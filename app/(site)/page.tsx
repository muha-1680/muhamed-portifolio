import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/db";

export const dynamic = "force-dynamic";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function HomePage() {
  const { about, contact, colors, cv, projects, experiences, skills, services, testimonials } =
    await getContent();

  const [firstName, ...restNames] = about.name.split(" ");
  const years = cv.stats.find((s) => /year/i.test(s.label))?.number ?? "3+";
  const projectCount = String(projects.length);

  return (
    <>
      <style>{`:root{--primary:${colors.primary};}`}</style>

      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <div className="hero-text">
          <h1>
            Hi, I&apos;m <span>{firstName}</span> 👋
          </h1>
          <div className="hero-role">{about.title.split("|")[0]?.trim() || about.title}</div>
          <p>{about.bio}</p>
          <div className="hero-btns">
            <a href="#contact" className="btn-o">
              Contact Me <i className="fas fa-arrow-right"></i>
            </a>
            <a href={cv.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-g">
              <i className="fas fa-download"></i> Download CV
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <b>{projectCount}</b>
              <span>Projects</span>
            </div>
            <div>
              <b>{years}</b>
              <span>Years</span>
            </div>
            <div>
              <b>{cv.education.length}</b>
              <span>Degrees</span>
            </div>
          </div>
        </div>
        <div className="hero-blob">
          <Image
            src={about.profilePhoto}
            alt={about.name}
            width={300}
            height={300}
            priority
            style={{ objectFit: "cover", borderRadius: "inherit", width: "82%", height: "88%" }}
          />
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <h2 className="sec" id="services">
        My <span>Services</span>
      </h2>
      <p className="sec-sub">Comprehensive digital solutions tailored to your business needs</p>
      <div className="grid3">
        {services.map((s, i) => (
          <div className="card" key={i}>
            <div className="ic">
              <i className={s.icon}></i>
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* ================= ABOUT ================= */}
      <h2 className="sec" id="about">
        About <span>Me</span>
      </h2>
      <div className="about-wrap">
        <div className="about-collage">
          {services.slice(0, 4).map((s, i) => (
            <div className="pg" key={i}>
              <i className={s.icon}></i>
            </div>
          ))}
          <div className="exp-badge">{years} Years Experience</div>
        </div>
        <div className="about-text">
          <div className="about-sub">{about.title}</div>
          <p>{about.bio}</p>
          <div className="about-cols">
            <div>
              <h4>
                <i className="fas fa-location-dot"></i> Location
              </h4>
              <small>{about.location}</small>
            </div>
            <div>
              <h4>
                <i className="fas fa-graduation-cap"></i> Education
              </h4>
              <small>
                {cv.education.map((e) => `${e.degree} — ${e.institution}`).join(" · ")}
              </small>
            </div>
            <div>
              <h4>
                <i className="fas fa-language"></i> Languages
              </h4>
              <small>
                {cv.languages.entries.map((l) => `${l.language} (${l.level})`).join(" · ")}
              </small>
            </div>
            <div>
              <h4>
                <i className="fas fa-briefcase"></i> Experience
              </h4>
              <small>
                {experiences.map((e) => `${e.title} — ${e.company}`).join(" · ") || "—"}
              </small>
            </div>
          </div>
          <div className="chips">
            {skills.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SKILLS & EXPERIENCE ================= */}
      <h2 className="sec" id="skills">
        Skills &amp; <span>Experience</span>
      </h2>
      <p className="sec-sub">My technical expertise and professional journey</p>
      <div className="grid3">
        {experiences.map((e, i) => (
          <div className="card" key={`exp-${i}`}>
            <h3>
              <i className="fas fa-briefcase"></i> {e.title}
            </h3>
            <p>
              {e.company} · {e.location} · {e.date}
              <br />
              {e.responsibilities.slice(0, 3).join(" ")}
            </p>
          </div>
        ))}
        {cv.education.map((e, i) => (
          <div className="card" key={`edu-${i}`}>
            <h3>
              <i className="fas fa-graduation-cap"></i> {e.degree}
            </h3>
            <p>
              {e.institution} · {e.date}
            </p>
          </div>
        ))}
      </div>

      {/* ================= PROJECTS ================= */}
      <h2 className="sec" id="projects">
        My <span>Projects</span>
      </h2>
      <p className="sec-sub">Recent work I&apos;m proud of</p>
      <div className="grid3">
        {projects.map((p, i) => (
          <div className="card" key={i}>
            <div className="ic">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3>{p.title}</h3>
            <p>
              {p.desc}
              <br />
              {p.tech.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <h2 className="sec" id="testimonials">
        Testi<span>monials</span>
      </h2>
      <p className="sec-sub">What people say about working with me</p>
      <div className="grid3">
        {testimonials.map((t, i) => (
          <div className="card tcard" key={i}>
            <div className="avatar">{initials(t.author)}</div>
            <div className="stars">★★★★★</div>
            <p>&ldquo;{t.quote}&rdquo;</p>
            <h3>{t.author}</h3>
            <small>{t.role}</small>
          </div>
        ))}
      </div>

      {/* ================= CONTACT ================= */}
      <footer id="contact">
        <div className="foot-big">Let&apos;s Work Together</div>
        <p>
          {contact.email} · {contact.phone} · {about.location}
        </p>
        <div className="soc">
          <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href={`https://t.me/${contact.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <i className="fab fa-telegram-plane"></i>
          </a>
          <a href={`https://x.com/${contact.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-x-twitter"></i>
          </a>
        </div>
        <a className="btn-o" href={`mailto:${contact.email}`}>
          Contact Me <i className="fas fa-arrow-right"></i>
        </a>
        <p style={{ marginTop: 26 }}>© {new Date().getFullYear()} {about.name}</p>
      </footer>
    </>
  );
}
