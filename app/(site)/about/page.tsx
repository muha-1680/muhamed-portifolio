import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const { about, contact } = await getContent();

  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-user-circle"></i> About Me
      </h2>
      <div className="page-card">
        <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          <strong>{about.name}</strong> — {about.title}
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.8 }}>{about.bio}</p>
        <div className="about-grid">
          <div className="about-item">
            <i className="fas fa-map-pin"></i>
            <span>
              <strong>Location:</strong> {about.location}
            </span>
          </div>
          <div className="about-item">
            <i className="fas fa-envelope"></i>
            <span>
              <strong>Email:</strong> {contact.email}
            </span>
          </div>
          <div className="about-item">
            <i className="fas fa-phone"></i>
            <span>
              <strong>Phone:</strong> {contact.phone}
            </span>
          </div>
          <div className="about-item">
            <i className="fas fa-graduation-cap"></i>
            <span>
              <strong>Education:</strong> BSc CS · BSc Management
            </span>
          </div>
          <div className="about-item">
            <i className="fas fa-globe"></i>
            <span>
              <strong>Languages:</strong> Amharic (Native) · English
              (Professional)
            </span>
          </div>
          <div className="about-item">
            <i className="fas fa-heart"></i>
            <span>
              <strong>Interests:</strong> Software Eng, Cloud, Full-Stack
            </span>
          </div>
        </div>
        <hr />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 8 }}>
          <a
            href={`https://${contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <i className="fab fa-github"></i> {contact.github}
          </a>
          <a
            href={`https://www.${contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <i className="fab fa-linkedin"></i> {contact.linkedin}
          </a>
        </div>
      </div>
    </>
  );
}