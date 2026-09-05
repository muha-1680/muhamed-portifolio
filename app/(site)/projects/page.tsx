import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
};

const PROJECT_ICONS = [
  "fa-home",
  "fa-hotel",
  "fa-comments",
  "fa-network-wired",
];

export default async function ProjectsPage() {
  const { projects } = await getContent();

  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-code"></i> Featured Projects
      </h2>
      <div className="project-grid">
        {projects.map((project, i) => (
          <div className="project-card" key={i}>
            <div className="project-icon">
              <i className={`fas ${PROJECT_ICONS[i] ?? "fa-code"}`}></i>
            </div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <div className="project-role">
              <i className="fas fa-user-tag"></i> My Role: {project.role}
            </div>
            <div className="chip-group">
              {project.tech.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}