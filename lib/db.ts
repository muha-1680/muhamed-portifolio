import { PrismaClient } from "@prisma/client";

import {
  defaultContent,
  type AboutContent,
  type ColorsContent,
  type Content,
  type ContactContent,
  type CVContent,
  type ExperienceContent,
  type ProjectContent,
} from "@/lib/content";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveDatabaseUrl(): string | undefined {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;
  if (!raw) return raw;
  // Vercel Postgres / Neon pooled endpoints go through PgBouncer, which requires
  // disabling Prisma's prepared statements to avoid "prepared statement already exists".
  if (/pgbouncer=true/.test(raw)) return raw;
  return raw.includes("?")
    ? `${raw}&pgbouncer=true&connection_limit=1`
    : `${raw}?pgbouncer=true&connection_limit=1`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ---------------------------------------------------------------------------
// Read — assembles the Content shape from the DB rows (defaults for missing rows)
// ---------------------------------------------------------------------------

// Circuit breaker: when the DB is unreachable, stop re-attempting a connection
// on every request (each failed attempt costs seconds) and serve defaults until
// the retry window elapses. Admin writes are never short-circuited.
let dbDownUntil = 0;
const DB_RETRY_MS = 30_000;

export async function getContent(): Promise<Content> {
  if (Date.now() < dbDownUntil) return defaultContent;
  try {
    const content = await readContentFromDb();
    dbDownUntil = 0;
    return content;
  } catch (err) {
    // DB unreachable (e.g. local preview without Postgres) — serve seeded defaults
    // so the site stays viewable. Admin writes will surface the real error.
    dbDownUntil = Date.now() + DB_RETRY_MS;
    console.error("[db] getContent failed, serving defaults:", err);
    return defaultContent;
  }
}

async function readContentFromDb(): Promise<Content> {
  const [about, contact, colors, cv, projects, experiences, skills] =
    await Promise.all([
      prisma.about.findUnique({ where: { id: 1 } }),
      prisma.contact.findUnique({ where: { id: 1 } }),
      prisma.colorTheme.findUnique({ where: { id: 1 } }),
      prisma.cv.findUnique({
        where: { id: 1 },
        include: {
          stats: { orderBy: { order: "asc" } },
          education: { orderBy: { order: "asc" } },
          languages: { orderBy: { order: "asc" } },
        },
      }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
    ]);

  return {
    about: about ?? defaultContent.about,
    contact: contact ?? defaultContent.contact,
    colors: colors
      ? { primary: colors.primary, bg: colors.bg }
      : defaultContent.colors,
    cv: cv
      ? {
          pdfUrl: cv.pdfUrl,
          profile: cv.profile,
          stats: cv.stats.map((s) => ({ label: s.label, number: s.number })),
          education: cv.education.map((e) => ({
            degree: e.degree,
            institution: e.institution,
            date: e.date,
          })),
          languages: {
            entries: cv.languages.map((l) => ({
              language: l.language,
              level: l.level,
            })),
          },
        }
      : defaultContent.cv,
    projects: projects.map((p) => ({
      title: p.title,
      desc: p.desc,
      role: p.role,
      tech: p.tech,
    })),
    experiences: experiences.map((e) => ({
      title: e.title,
      company: e.company,
      location: e.location,
      date: e.date,
      responsibilities: e.responsibilities,
    })),
    skills: skills.map((s) => s.name),
  };
}

// ---------------------------------------------------------------------------
// Write — upsert provided sections; sections absent from the patch stay intact
// ---------------------------------------------------------------------------

export async function saveContent(patch: {
  about?: Partial<AboutContent>;
  contact?: Partial<ContactContent>;
  colors?: Partial<ColorsContent>;
  cv?: Partial<CVContent>;
  projects?: ProjectContent[];
  experiences?: ExperienceContent[];
  skills?: string[];
}): Promise<Content> {
  if (patch.about) await upsertAbout(patch.about);
  if (patch.contact) await upsertContact(patch.contact);
  if (patch.colors) await upsertColors(patch.colors);
  if (patch.cv) await upsertCv(patch.cv);
  if (patch.projects) await syncProjects(patch.projects);
  if (patch.experiences) await syncExperiences(patch.experiences);
  if (patch.skills) await syncSkills(patch.skills);

  return getContent();
}

// ---------------------------------------------------------------------------
// Single-row upserts
// ---------------------------------------------------------------------------

async function upsertAbout(next: Partial<AboutContent>) {
  const data = {
    name: next.name ?? defaultContent.about.name,
    title: next.title ?? defaultContent.about.title,
    bio: next.bio ?? defaultContent.about.bio,
    location: next.location ?? defaultContent.about.location,
    profilePhoto: next.profilePhoto ?? defaultContent.about.profilePhoto,
  };
  await prisma.about.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
}

async function upsertContact(next: Partial<ContactContent>) {
  const data = {
    email: next.email ?? defaultContent.contact.email,
    phone: next.phone ?? defaultContent.contact.phone,
    github: next.github ?? defaultContent.contact.github,
    linkedin: next.linkedin ?? defaultContent.contact.linkedin,
    twitter: next.twitter ?? defaultContent.contact.twitter,
    telegram: next.telegram ?? defaultContent.contact.telegram,
  };
  await prisma.contact.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
}

async function upsertColors(next: Partial<ColorsContent>) {
  const data = {
    primary: next.primary ?? defaultContent.colors.primary,
    bg: next.bg ?? defaultContent.colors.bg,
  };
  await prisma.colorTheme.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
}

async function upsertCv(next: Partial<CVContent>) {
  const base = {
    pdfUrl: next.pdfUrl ?? defaultContent.cv.pdfUrl,
    profile: next.profile ?? defaultContent.cv.profile,
  };

  await prisma.$transaction(async (tx) => {
    await tx.cv.upsert({ where: { id: 1 }, update: base, create: { id: 1, ...base } });

    if (Array.isArray(next.stats)) {
      await tx.cvStat.deleteMany({ where: { cvId: 1 } });
      if (next.stats.length) {
        await tx.cvStat.createMany({
          data: next.stats.map((s, i) => ({ cvId: 1, order: i, label: s.label, number: s.number })),
        });
      }
    }

    if (Array.isArray(next.education)) {
      await tx.cvEducation.deleteMany({ where: { cvId: 1 } });
      if (next.education.length) {
        await tx.cvEducation.createMany({
          data: next.education.map((e, i) => ({
            cvId: 1,
            order: i,
            degree: e.degree,
            institution: e.institution,
            date: e.date,
          })),
        });
      }
    }

    if (next.languages && Array.isArray(next.languages.entries)) {
      await tx.cvLanguage.deleteMany({ where: { cvId: 1 } });
      if (next.languages.entries.length) {
        await tx.cvLanguage.createMany({
          data: next.languages.entries.map((l, i) => ({
            cvId: 1,
            order: i,
            language: l.language,
            level: l.level,
          })),
        });
      }
    }
  });
}

// ---------------------------------------------------------------------------
// List sync — delete + recreate keeps ordering identical to the admin UI
// ---------------------------------------------------------------------------

async function syncProjects(projects: ProjectContent[]) {
  await prisma.$transaction(async (tx) => {
    await tx.project.deleteMany();
    if (projects.length) {
      await tx.project.createMany({
        data: projects.map((p, i) => ({
          order: i,
          title: p.title,
          desc: p.desc,
          role: p.role,
          tech: p.tech,
        })),
      });
    }
  });
}

async function syncExperiences(experiences: ExperienceContent[]) {
  await prisma.$transaction(async (tx) => {
    await tx.experience.deleteMany();
    if (experiences.length) {
      await tx.experience.createMany({
        data: experiences.map((e, i) => ({
          order: i,
          title: e.title,
          company: e.company,
          location: e.location,
          date: e.date,
          responsibilities: e.responsibilities,
        })),
      });
    }
  });
}

async function syncSkills(skills: string[]) {
  await prisma.$transaction(async (tx) => {
    await tx.skill.deleteMany();
    if (skills.length) {
      await tx.skill.createMany({
        data: skills.map((name, i) => ({ order: i, name })),
      });
    }
  });
}
