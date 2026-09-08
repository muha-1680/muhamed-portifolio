import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const { about, contact } = await getContent();
  const telHref = contact.phone.replace(/[^+\d]/g, "");

  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-envelope"></i> Get In Touch
      </h2>
      <div className="contact-grid">
        <a href={`mailto:${contact.email}`} className="contact-card">
          <div className="contact-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="contact-info">
            <div className="label">Email</div>
            <div className="value">{contact.email}</div>
          </div>
        </a>

        <a href={`tel:${telHref}`} className="contact-card">
          <div className="contact-icon">
            <i className="fas fa-phone"></i>
          </div>
          <div className="contact-info">
            <div className="label">Phone</div>
            <div className="value">{contact.phone}</div>
          </div>
        </a>

        <a
          href={`https://${contact.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-icon">
            <i className="fab fa-github"></i>
          </div>
          <div className="contact-info">
            <div className="label">GitHub</div>
            <div className="value">{contact.github}</div>
          </div>
        </a>

        <a
          href={`https://www.linkedin.com/in/${contact.linkedin.replace(/^linkedin\.com\/in\//, "").replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-icon">
            <i className="fab fa-linkedin-in"></i>
          </div>
          <div className="contact-info">
            <div className="label">LinkedIn</div>
            <div className="value">{contact.linkedin}</div>
          </div>
        </a>

        <a
          href={`https://twitter.com/${contact.twitter.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-icon">
            <i className="fab fa-twitter"></i>
          </div>
          <div className="contact-info">
            <div className="label">Twitter / X</div>
            <div className="value">{contact.twitter}</div>
          </div>
        </a>

        <a
          href={`https://t.me/${contact.telegram.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-icon">
            <i className="fab fa-telegram"></i>
          </div>
          <div className="contact-info">
            <div className="label">Telegram</div>
            <div className="value">{contact.telegram}</div>
          </div>
        </a>
      </div>

      <div className="contact-note">
        <p>
          <i className="fas fa-heart" style={{ color: "var(--primary)" }}></i>{" "}
          I&apos;m open to opportunities in{" "}
          <strong>Software Engineering</strong>, <strong>Full-Stack
          Development</strong>, <strong>IT Support</strong>,{" "}
          <strong>Cloud Computing</strong>, and{" "}
          <strong>Systems Administration</strong>.
        </p>
        <p style={{ marginTop: 8, fontSize: "0.9rem" }}>
          <i className="fas fa-map-pin"></i> {about.location}
          &nbsp;·&nbsp;
          <i className="fas fa-clock"></i> Available for work
        </p>
      </div>
    </>
  );
}