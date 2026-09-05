import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
};

const EXPERIENCE_CHIPS = [
  "Enterprise Networking",
  "Technical Support",
  "System Administration",
  "LAN Management",
  "Hardware Maintenance",
  "Security Protocols",
];

export default async function ExperiencePage() {
  const { experiences } = await getContent();

  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-briefcase"></i> Professional Experience
      </h2>

      {experiences.map((exp, i) => (
        <div className="page-card" key={i}>
          <h3>
            <i className="fas fa-building"></i> {exp.company}
          </h3>
          <div className="job-title">{exp.title}</div>
          <span className="date-badge">
            <i className="far fa-calendar-alt"></i> {exp.date}
          </span>
          <p style={{ marginTop: 12, fontStyle: "italic", color: "#6b7280" }}>
            <i className="fas fa-map-pin" style={{ color: "var(--primary)" }}></i>{" "}
            {exp.location}
          </p>
          <ul>
            {exp.responsibilities.map((r, j) => (
              <li key={j}>{r}</li>
            ))}
          </ul>
          <div className="chip-group">
            {EXPERIENCE_CHIPS.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div
        className="page-card"
        style={{ border: "2px dashed var(--primary)", background: "#f8faff" }}
      >
        <h3>
          <i className="fas fa-graduation-cap"></i> Academic Projects &amp;
          Research
        </h3>
        <p style={{ marginTop: 8, lineHeight: 1.8 }}>
          Throughout my Computer Science degree, I completed numerous academic
          projects including:
        </p>
        <ul>
          <li>
            <strong>Household Services Management System</strong> — Final year
            group project (Web-based platform)
          </li>
          <li>
            <strong>Hotel Management System</strong> — Full-stack booking and
            reservation system
          </li>
          <li>
            <strong>Distributed Chat System</strong> — Java socket programming
            with client-server architecture
          </li>
          <li>
            <strong>Network Simulation &amp; Analysis</strong> — Using Cisco
            Packet Tracer for LAN/WAN setups
          </li>
        </ul>
        <div className="chip-group">
          <span className="chip">Project Management</span>
          <span className="chip">Team Collaboration</span>
          <span className="chip">Research</span>
          <span className="chip">Documentation</span>
        </div>
      </div>
    </>
  );
}