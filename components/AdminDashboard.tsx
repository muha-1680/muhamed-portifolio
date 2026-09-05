"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/lib/content";

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load current content
  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: Content) => setContent(data))
      .catch(() => alert("Failed to load content."));
  }, []);

  // Live-apply theme colors while editing
  useEffect(() => {
    if (!content) return;
    document.documentElement.style.setProperty("--primary", content.colors.primary);
    document.documentElement.style.setProperty("--bg", content.colors.bg);
  }, [content]);

  function flash(section: string) {
    setSaved(section);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(null), 2000);
  }

  async function persist(next: Content) {
    setContent(next);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) alert("Failed to save — please try again.");
    } catch {
      alert("Network error while saving.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (!content) {
    return <div style={{ textAlign: "center", padding: 40 }}>Loading…</div>;
  }

  // ---------- field helpers ----------
  function setAboutField<K extends keyof Content["about"]>(field: K, value: string) {
    setContent((prev) =>
      prev ? { ...prev, about: { ...prev.about, [field]: value } } : prev,
    );
  }

  function setContactField<K extends keyof Content["contact"]>(field: K, value: string) {
    setContent((prev) =>
      prev ? { ...prev, contact: { ...prev.contact, [field]: value } } : prev,
    );
  }

  function setProjectField(
    index: number,
    field: "title" | "desc" | "role" | "tech",
    value: string,
  ) {
    setContent((prev) => {
      if (!prev) return prev;
      const projects = prev.projects.map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      );
      return { ...prev, projects };
    });
  }

  function setExperienceField(
    index: number,
    field: "title" | "company" | "location" | "date" | "responsibilities",
    value: string,
  ) {
    setContent((prev) => {
      if (!prev) return prev;
      const experiences = prev.experiences.map((e, i) =>
        i === index ? { ...e, [field]: value } : e,
      );
      return { ...prev, experiences };
    });
  }

  // ---------- save actions ----------
  function saveAbout() {
    if (!content) return;
    void persist(content);
    flash("about");
  }

  function saveContact() {
    if (!content) return;
    void persist(content);
    flash("contact");
  }

  function saveSkills() {
    if (!content) return;
    void persist(content);
    flash("skills");
  }

  function saveColors() {
    if (!content) return;
    void persist(content);
    flash("colors");
  }

  function saveProject(index: number, raw: string, field: "title" | "desc" | "role" | "tech") {
    if (!content) return;
    const next: Content = {
      ...content,
      projects: content.projects.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]:
                field === "tech"
                  ? raw.split(",").map((s) => s.trim()).filter(Boolean)
                  : raw,
            }
          : p,
      ),
    };
    void persist(next);
  }

  function saveExperience(
    index: number,
    raw: string,
    field: "title" | "company" | "location" | "date" | "responsibilities",
  ) {
    if (!content) return;
    const next: Content = {
      ...content,
      experiences: content.experiences.map((e, i) =>
        i === index
          ? {
              ...e,
              [field]:
                field === "responsibilities"
                  ? raw.split("\n").map((s) => s.trim()).filter(Boolean)
                  : raw,
            }
          : e,
      ),
    };
    void persist(next);
  }

  function addProject() {
    if (!content) return;
    const next: Content = {
      ...content,
      projects: [
        ...content.projects,
        { title: "New Project", desc: "Description", role: "Developer", tech: ["HTML", "CSS"] },
      ],
    };
    void persist(next);
  }

  function deleteProject(index: number) {
    if (!content) return;
    const next: Content = {
      ...content,
      projects: content.projects.filter((_, i) => i !== index),
    };
    void persist(next);
  }

  function addExperience() {
    if (!content) return;
    const next: Content = {
      ...content,
      experiences: [
        ...content.experiences,
        {
          title: "New Job Title",
          company: "Company Name",
          location: "",
          date: "Month Year",
          responsibilities: ["Responsibility 1", "Responsibility 2"],
        },
      ],
    };
    void persist(next);
  }

  function deleteExperience(index: number) {
    if (!content) return;
    const next: Content = {
      ...content,
      experiences: content.experiences.filter((_, i) => i !== index),
    };
    void persist(next);
  }

  function saveButtonLabel(section: string, label: string, icon: string) {
    return saved === section ? (
      "✅ Saved!"
    ) : (
      <>
        <i className={`fas ${icon}`}></i> {label}
      </>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>
          <i className="fas fa-cog"></i> Portfolio Admin
        </h1>
        <button className="logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="section-grid">
        {/* ABOUT */}
        <div className="section-card">
          <h3>
            <i className="fas fa-user"></i> About Me
          </h3>
          <label>Your Name</label>
          <input
            type="text"
            value={content.about.name}
            onChange={(e) => setAboutField("name", e.target.value)}
          />
          <label>Title</label>
          <input
            type="text"
            value={content.about.title}
            onChange={(e) => setAboutField("title", e.target.value)}
          />
          <label>Bio</label>
          <textarea
            value={content.about.bio}
            onChange={(e) => setAboutField("bio", e.target.value)}
          />
          <label>Location</label>
          <input
            type="text"
            value={content.about.location}
            onChange={(e) => setAboutField("location", e.target.value)}
          />
          <button className="save-btn" onClick={saveAbout}>
            {saveButtonLabel("about", "Save About", "fa-save")}
          </button>
        </div>

        {/* EXPERIENCE */}
        <div className="section-card">
          <h3>
            <i className="fas fa-briefcase"></i> Experience
          </h3>
          <div id="experienceList">
            {content.experiences.map((exp, i) => (
              <div className="project-item" key={i}>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => setExperienceField(i, "title", e.target.value)}
                  onBlur={(e) => saveExperience(i, e.target.value, "title")}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => setExperienceField(i, "company", e.target.value)}
                  onBlur={(e) => saveExperience(i, e.target.value, "company")}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => setExperienceField(i, "location", e.target.value)}
                  onBlur={(e) => saveExperience(i, e.target.value, "location")}
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={exp.date}
                  onChange={(e) => setExperienceField(i, "date", e.target.value)}
                  onBlur={(e) => saveExperience(i, e.target.value, "date")}
                />
                <textarea
                  placeholder="Responsibilities (one per line)"
                  value={exp.responsibilities.join("\n")}
                  onChange={(e) =>
                    setExperienceField(i, "responsibilities", e.target.value)
                  }
                  onBlur={(e) =>
                    saveExperience(i, e.target.value, "responsibilities")
                  }
                />
                <button
                  className="delete-btn"
                  onClick={() => deleteExperience(i)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            ))}
          </div>
          <button className="add-project-btn" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>

        {/* PROJECTS */}
        <div className="section-card">
          <h3>
            <i className="fas fa-code"></i> Projects
          </h3>
          <div id="projectList">
            {content.projects.map((project, i) => (
              <div className="project-item" key={i}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => setProjectField(i, "title", e.target.value)}
                  onBlur={(e) => saveProject(i, e.target.value, "title")}
                />
                <textarea
                  placeholder="Description"
                  value={project.desc}
                  onChange={(e) => setProjectField(i, "desc", e.target.value)}
                  onBlur={(e) => saveProject(i, e.target.value, "desc")}
                />
                <input
                  type="text"
                  placeholder="Your Role"
                  value={project.role}
                  onChange={(e) => setProjectField(i, "role", e.target.value)}
                  onBlur={(e) => saveProject(i, e.target.value, "role")}
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={project.tech.join(", ")}
                  onChange={(e) => setProjectField(i, "tech", e.target.value)}
                  onBlur={(e) => saveProject(i, e.target.value, "tech")}
                />
                <button
                  className="delete-btn"
                  onClick={() => deleteProject(i)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            ))}
          </div>
          <button className="add-project-btn" onClick={addProject}>
            <i className="fas fa-plus"></i> Add Project
          </button>
        </div>

        {/* SKILLS */}
        <div className="section-card">
          <h3>
            <i className="fas fa-cog"></i> Skills
          </h3>
          <label>Skills (comma separated)</label>
          <input
            type="text"
            value={content.skills.join(", ")}
            onChange={(e) =>
              setContent((prev) =>
                prev
                  ? {
                      ...prev,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }
                  : prev,
              )
            }
          />
          <button className="save-btn" onClick={saveSkills}>
            {saveButtonLabel("skills", "Save Skills", "fa-save")}
          </button>
          <div style={{ marginTop: 12 }}>
            {content.skills.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* COLORS */}
        <div className="section-card">
          <h3>
            <i className="fas fa-palette"></i> Colors
          </h3>
          <label>Primary Color</label>
          <input
            type="color"
            value={content.colors.primary}
            onChange={(e) =>
              setContent((prev) =>
                prev
                  ? { ...prev, colors: { ...prev.colors, primary: e.target.value } }
                  : prev,
              )
            }
          />
          <label>Background Color</label>
          <input
            type="color"
            value={content.colors.bg}
            onChange={(e) =>
              setContent((prev) =>
                prev
                  ? { ...prev, colors: { ...prev.colors, bg: e.target.value } }
                  : prev,
              )
            }
          />
          <button className="save-btn" onClick={saveColors}>
            {saveButtonLabel("colors", "Apply Colors", "fa-save")}
          </button>
        </div>

        {/* CONTACT */}
        <div className="section-card">
          <h3>
            <i className="fas fa-envelope"></i> Contact
          </h3>
          <label>Email</label>
          <input
            type="text"
            value={content.contact.email}
            onChange={(e) => setContactField("email", e.target.value)}
          />
          <label>Phone</label>
          <input
            type="text"
            value={content.contact.phone}
            onChange={(e) => setContactField("phone", e.target.value)}
          />
          <label>GitHub</label>
          <input
            type="text"
            value={content.contact.github}
            onChange={(e) => setContactField("github", e.target.value)}
          />
          <label>LinkedIn</label>
          <input
            type="text"
            value={content.contact.linkedin}
            onChange={(e) => setContactField("linkedin", e.target.value)}
          />
          <button className="save-btn" onClick={saveContact}>
            {saveButtonLabel("contact", "Save Contact", "fa-save")}
          </button>
        </div>
      </div>
    </div>
  );
}