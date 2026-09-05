import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

export default async function LandingPage() {
  const { about } = await getContent();

  return (
    <div className="landing-wrap">
      <div className="welcome-card">
        <div className="big-icon">
          <i className="fas fa-code"></i>
        </div>
        <h1>
          Welcome to <span>My Portfolio</span>
        </h1>
        <p>
          I&apos;m <strong>{about.name}</strong>, a passionate Software
          Developer and Computer Science graduate. Explore my work, skills, and
          experience.
        </p>
        <div className="cta-buttons">
          <Link href="/about" className="btn btn-primary">
            <i className="fas fa-user"></i> About Me
          </Link>
          <Link href="/projects" className="btn btn-outline">
            <i className="fas fa-code"></i> View Projects
          </Link>
          <Link href="/cv" className="btn btn-outline">
            <i className="fas fa-file-pdf"></i> View CV
          </Link>
        </div>
      </div>
    </div>
  );
}