import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CV",
};

export default async function CVPage() {
  const { cv, skills, experiences, projects } = await getContent();

  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-file-pdf"></i> My Resume / CV
      </h2>

      <div className="cv-header">
        <h2>
          <i className="fas fa-download"></i> Muhamed Ahmed - Curriculum Vitae
        </h2>
        <a
          href={cv.pdfUrl}
          download
          className="download-btn"
        >
          <i className="fas fa-download"></i> Download PDF
        </a>
      </div>

      <div className="quick-stats">
        {cv.stats.map((stat) => (
          <div className="stat-box" key={stat.label}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="cv-grid">
          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-user"></i> Profile
            </div>
            <div className="cv-value">{cv.profile}</div>
          </div>

          <div className="cv-item">
            <div className="cv-label">
              <i className="fas fa-graduation-cap"></i> Education
            </div>
            <div className="cv-value">
              {cv.education.map((edu, i) => (
                <div key={i}>
                  <strong>{edu.degree}</strong>
                  <br />
                  {edu.institution}
                  <br />
                  {edu.date}
                  {i < cv.education.length - 1 && <br />}
                  {i < cv.education.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>

          <div className="cv-item">
            <div className="cv-label">
              <i className="fas fa-globe"></i> Languages
            </div>
            <div className="cv-value">
              {cv.languages.entries.map((lang, i) => (
                <div key={i}>
                  <strong>{lang.language}</strong> — {lang.level}
                  <br />
                </div>
              ))}
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-briefcase"></i> Professional Experience
            </div>
            <div className="cv-value">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <strong>{exp.title}</strong>
                  <br />
                  {exp.company}
                  <br />
                  <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    {exp.date}
                  </span>
                  <ul>
                    {exp.responsibilities.map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-code"></i> Projects
            </div>
            <div className="cv-value">
              {projects.map((proj, i) => (
                <div key={i}>
                  <strong>{proj.title}</strong>
                  <br />
                  {proj.desc}
                  <br />
                  <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    {proj.role}
                  </span>
                  <div>
                    <strong>Role:</strong> {proj.role}
                  </div>
                  <div className="chip-group">
                    {proj.tech.map((t) => (
                      <span className="chip" key={t}>{t}</span>
                    ))}
                  </div>
                  {i < projects.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-cogs"></i> Professional Skills
            </div>
            <div className="cv-value">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="chip"
                    style={{
                      background: "#eef2ff",
                      padding: "4px 16px",
                      borderRadius: 30,
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}