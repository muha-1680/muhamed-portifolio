import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
};

const PROFESSIONAL_SKILLS = [
  "Software Development",
  "Problem Solving",
  "Team Collaboration",
  "Analytical Thinking",
  "Time Management",
  "Communication",
  "Technical Documentation",
  "Adaptability",
  "Continuous Learning",
];

export default function CVPage() {
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
          href="/Muhamed_Ahmed_FlowCV_Resume_2026-07-24.pdf"
          download
          className="download-btn"
        >
          <i className="fas fa-download"></i> Download PDF
        </a>
      </div>

      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-number">3+</div>
          <div className="stat-label">Years Experience</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">8</div>
          <div className="stat-label">Projects Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">2</div>
          <div className="stat-label">Degrees</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">5</div>
          <div className="stat-label">Technologies</div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="cv-grid">
          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-user"></i> Profile
            </div>
            <div className="cv-value">
              I&apos;m Muhamed Ahmed, a software development professional with a
              passion for helping companies achieve their growth potential. With
              degrees in Computer Science and Management, I have extensive
              experience in relationship building, and I strive to provide
              innovative solutions that drive success for my clients.
            </div>
          </div>

          <div className="cv-item">
            <div className="cv-label">
              <i className="fas fa-graduation-cap"></i> Education
            </div>
            <div className="cv-value">
              <strong>Bachelor of Science in Computer Science</strong>
              <br />
              University of Gondar
              <br />
              2021 – 2026
              <br />
              <br />
              <strong>Bachelor of Management</strong>
              <br />
              Othionial College
              <br />
              2021 – 2026
            </div>
          </div>

          <div className="cv-item">
            <div className="cv-label">
              <i className="fas fa-globe"></i> Languages
            </div>
            <div className="cv-value">
              <strong>Amharic</strong> — Native
              <br />
              <strong>English</strong> — Professional Working Proficiency
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-briefcase"></i> Professional Experience
            </div>
            <div className="cv-value">
              <strong>IT Intern — Networking &amp; Maintenance</strong>
              <br />
              Commercial Bank of Ethiopia (CBE), She Ali Branch - Gondar
              <br />
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                October 2025 – December 2025
              </span>
              <ul>
                <li>
                  Assisted in maintaining computer systems and network
                  infrastructure.
                </li>
                <li>Configured LAN connectivity and network devices.</li>
                <li>Supported router and switch configuration.</li>
                <li>
                  Installed and updated operating systems and software.
                </li>
                <li>Diagnosed hardware and software issues.</li>
                <li>Performed preventive system maintenance.</li>
                <li>
                  Worked with the IT team to maintain secure banking
                  operations.
                </li>
                <li>Followed IT security policies and procedures.</li>
              </ul>
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-code"></i> Projects
            </div>
            <div className="cv-value">
              <strong>Household Services Management System</strong>
              <br />
              University Final-Year Group Project
              <br />
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                January 2025 – September 2026
              </span>
              <div style={{ marginTop: 4 }}>
                <strong>Role:</strong> Frontend Development · User Interface
                Design · Testing and Documentation · Team Collaboration
              </div>
              <div className="chip-group">
                <span className="chip">HTML</span>
                <span className="chip">CSS</span>
                <span className="chip">Bootstrap</span>
                <span className="chip">JavaScript</span>
                <span className="chip">PHP</span>
                <span className="chip">MySQL</span>
              </div>
              <br />
              <strong>Hotel Management System</strong>
              <br />
              Web-based application for hotel reservation and customer
              management.
              <br />
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                November 2025 – December 2025
              </span>
              <div className="chip-group">
                <span className="chip">HTML</span>
                <span className="chip">CSS</span>
                <span className="chip">Bootstrap</span>
                <span className="chip">JavaScript</span>
                <span className="chip">PHP</span>
                <span className="chip">MySQL</span>
              </div>
            </div>
          </div>

          <div className="cv-item cv-full">
            <div className="cv-label">
              <i className="fas fa-cogs"></i> Professional Skills
            </div>
            <div className="cv-value">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROFESSIONAL_SKILLS.map((skill) => (
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