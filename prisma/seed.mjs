// One-off seed: migrates data/content.json (or lib defaults) into Postgres.
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

const FALLBACK = {
  about: {
    name: "Muhamed Ahmed Shifaw",
    title: "Software Developer | Full-Stack Developer | Computer Science Graduate",
    bio: "Building innovative, secure, and user-focused software solutions.",
    location: "Gondar, Ethiopia",
    profilePhoto: "/my.jpg",
  },
  contact: {
    email: "994muhamedahmed@gmail.com",
    phone: "+251 909 041 680",
    github: "github.com/muha-1680",
    linkedin: "linkedin.com/in/muhamed-ahmed",
    twitter: "@muhamed83085",
    telegram: "@MUHAMED_SHIFAW",
  },
  colors: { primary: "#2563eb", bg: "#f0f2f5" },
  cv: {
    pdfUrl: "/Muhamed_Ahmed_FlowCV_Resume_2026-07-24.pdf",
    profile: "I'm Muhamed Ahmed, a software development professional.",
    stats: [{ label: "Years Experience", number: "3+" }],
    education: [],
    languages: { entries: [] },
  },
};

function loadContent() {
  try {
    const raw = readFileSync("data/content.json", "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed?.about?.name) throw new Error("no about.name in content.json");
    console.log("Seeding from data/content.json");
    return parsed;
  } catch {
    console.log("data/content.json unavailable — seeding minimal fallback");
    return FALLBACK;
  }
}

async function main() {
  const c = loadContent();

  await prisma.about.upsert({
    where: { id: 1 },
    update: c.about,
    create: { id: 1, ...c.about },
  });
  await prisma.contact.upsert({
    where: { id: 1 },
    update: c.contact,
    create: { id: 1, ...c.contact },
  });
  await prisma.colorTheme.upsert({
    where: { id: 1 },
    update: c.colors,
    create: { id: 1, ...c.colors },
  });
  await prisma.cv.upsert({
    where: { id: 1 },
    update: { pdfUrl: c.cv.pdfUrl, profile: c.cv.profile },
    create: { id: 1, pdfUrl: c.cv.pdfUrl, profile: c.cv.profile },
  });

  if (Array.isArray(c.projects)) {
    await prisma.project.deleteMany();
    await prisma.project.createMany({
      data: c.projects.map((p, i) => ({ order: i, ...p })),
    });
  }

  if (Array.isArray(c.experiences)) {
    await prisma.experience.deleteMany();
    await prisma.experience.createMany({
      data: c.experiences.map((e, i) => ({ order: i, ...e })),
    });
  }

  if (Array.isArray(c.skills)) {
    await prisma.skill.deleteMany();
    await prisma.skill.createMany({
      data: c.skills.map((name, i) => ({ order: i, name })),
    });
  }

  if (Array.isArray(c.cv?.stats)) {
    await prisma.cvStat.deleteMany();
    await prisma.cvStat.createMany({
      data: c.cv.stats.map((s, i) => ({ cvId: 1, order: i, ...s })),
    });
  }
  if (Array.isArray(c.cv?.education)) {
    await prisma.cvEducation.deleteMany();
    await prisma.cvEducation.createMany({
      data: c.cv.education.map((e, i) => ({ cvId: 1, order: i, ...e })),
    });
  }
  if (Array.isArray(c.cv?.languages?.entries)) {
    await prisma.cvLanguage.deleteMany();
    await prisma.cvLanguage.createMany({
      data: c.cv.languages.entries.map((l, i) => ({ cvId: 1, order: i, ...l })),
    });
  }

  console.log("Seed complete ✓");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
