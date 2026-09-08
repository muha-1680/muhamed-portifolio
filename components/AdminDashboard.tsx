"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mergeCV } from "@/lib/cv-utils";
import type { Content, CVContent } from "@/lib/content";

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [flashMsg, setFlashMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: Content) => setContent(data))
      .catch(() => setFlashMsg({ text: "Failed to load content.", type: "error" }));
  }, []);

  useEffect(() => {
    if (!content) return;
    document.documentElement.style.setProperty(
      "--primary",
      content.colors.primary,
    );
    document.documentElement.style.setProperty("--bg", content.colors.bg);
  }, [content]);

  function showFlash(text: string, type: "success" | "error" = "success") {
    setFlashMsg({ text, type });
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setFlashMsg(null), 2200);
  }

  async function persist(next: Content) {
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Save failed");
      // Re-fetch so the public site and admin both reflect the latest persisted state
      const fresh = (await res.json()) as Content;
      setContent(fresh);
      showFlash("Saved successfully ✓");
    } catch {
      showFlash("Failed to save — please try again.", "error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  // ---------- field helpers ----------
  function setAboutField<K extends keyof Content["about"]>(
    field: K,
    value: string,
  ) {
    setContent((prev) =>
      prev ? { ...prev, about: { ...prev.about, [field]: value } } : prev,
    );
  }

  function setContactField<K extends keyof Content["contact"]>(
    field: K,
    value: string,
  ) {
    setContent((prev) =>
      prev
        ? { ...prev, contact: { ...prev.contact, [field]: value } }
        : prev,
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

  // ---------- CV field helpers (mergeCV keeps the rest intact) ----------
  function setCVField(partial: Partial<CVContent>) {
    setContent((prev) =>
      prev ? { ...prev, cv: mergeCV(prev.cv, partial) } : prev,
    );
  }

  function setCVStat(index: number, field: "label" | "number", value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const stats = prev.cv.stats.map((s, i) =>
        i === index ? { ...s, [field]: value } : s,
      );
      return { ...prev, cv: mergeCV(prev.cv, { stats }) };
    });
  }

  function setCVEdu(index: number, field: "degree" | "institution" | "date", value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const education = prev.cv.education.map((e, i) =>
        i === index ? { ...e, [field]: value } : e,
      );
      return { ...prev, cv: mergeCV(prev.cv, { education }), };
    });
  }

  function setCVLang(index: number, field: "language" | "level", value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const entries = prev.cv.languages.entries.map((e, i) =>
        i === index ? { ...e, [field]: value } : e,
      );
      return {
        ...prev,
        cv: mergeCV(prev.cv, {
          languages: { entries },
        }),
      };
    });
  }

  // ---------- photo upload ----------
  async function uploadProfilePhoto(file: File) {
    if (!file) return null;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload-profile", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(body.error || "Photo upload failed.");
    }
    const data = (await res.json()) as { ok: boolean; url?: string };
    return data.url ?? null;
  }

  // ---------- PDF upload ----------
  async function uploadPdf(file: File) {
    if (!file) return null;
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed.");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("PDF must be under 10 MB.");
    }
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload-cv", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(body.error || "PDF upload failed.");
    }
    const data = (await res.json()) as { ok: boolean; url?: string };
    return data.url ?? null;
  }

  if (!content) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
          color: "#94a3b8",
        }}
      >
        <i
          className="fas fa-spinner fa-spin"
          style={{ fontSize: 2, color: "var(--primary)", marginBottom: 12 }}
        ></i>
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-title">
        <h1>
          <i className="fas fa-cog"></i> Dashboard
        </h1>
        <span className="breadcrumb">Portfolio Admin</span>
      </div>

      <div className="section-grid">
        {/* ===================== ABOUT ===================== */}
        <div className="section-card" id="about">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-user"></i> About Me
            </h3>
            <span className="section-badge">Profile</span>
          </div>

          {/* Photo upload widget */}
          <div className="photo-upload-widget">
            <img
              src={content.about.profilePhoto ?? "/my.jpg"}
              alt="Current profile photo"
              className="current-photo"
            />
            <div className="photo-info">
              <div className="photo-label">Profile Photo</div>
              <div className="photo-filename">
                {content.about.profilePhoto?.replace(/^.*\//, "") ??
                  "my.jpg"}
              </div>
              <div className="photo-actions">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  id="profilePhotoInput"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const preview = URL.createObjectURL(file);
                    setContent((prev) =>
                      prev
                        ? {
                            ...prev,
                            about: {
                              ...prev.about,
                              profilePhoto: preview,
                            },
                          }
                        : prev,
                    );
                  }}
                />
                <button
                  className="choose-file-btn"
                  onClick={() => {
                    const input =
                      document.getElementById(
                        "profilePhotoInput",
                      ) as HTMLInputElement;
                    if (input) input.click();
                  }}
                >
                  <i className="fas fa-upload"></i> Choose File
                </button>
                <button
                  className="save-photo-btn"
                  onClick={async () => {
                    const preview =
                      content.about.profilePhoto ??
                      "/my.jpg";
                    const isLocalPreview =
                      preview.startsWith("blob:") ||
                      preview === "/my.jpg";

                    if (isLocalPreview) {
                      const input =
                        document.getElementById(
                          "profilePhotoInput",
                        ) as HTMLInputElement;
                      if (!input?.files?.[0]) {
                        showFlash("Please choose a photo first.", "error");
                        return;
                      }
                      try {
                        const url = await uploadProfilePhoto(
                          input.files[0],
                        );
                        if (!url) return;
                        // Persist the blob URL to the content store immediately
                        persist({
                          ...content,
                          about: {
                            ...content.about,
                            profilePhoto: url,
                          },
                        });
                      } catch (err) {
                        showFlash(
                          (err as Error).message,
                          "error",
                        );
                      }
                      return;
                    }

                    // Already a blob URL — just persist
                    persist(content);
                    showFlash("Photo saved ✓");
                  }}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  Upload & Save
                </button>
              </div>
            </div>
          </div>

          {/* About fields */}
          <label>Your Name</label>
          <input
            type="text"
            value={content.about.name}
            onChange={(e) =>
              setAboutField("name", e.target.value)
            }
            placeholder="Full name"
          />

          <label>Title</label>
          <input
            type="text"
            value={content.about.title}
            onChange={(e) =>
              setAboutField("title", e.target.value)
            }
            placeholder="Professional title"
          />

          <label>Bio</label>
          <textarea
            value={content.about.bio}
            onChange={(e) =>
              setAboutField("bio", e.target.value)
            }
            placeholder="Short bio…"
          />

          <label>Location</label>
          <input
            type="text"
            value={content.about.location}
            onChange={(e) =>
              setAboutField("location", e.target.value)
            }
            placeholder="City, Country"
          />

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save About
          </button>
        </div>

        {/* ===================== EXPERIENCE ===================== */}
        <div className="section-card" id="experience">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-briefcase"></i> Experience
            </h3>
            <span className="section-badge">Jobs</span>
          </div>

          {content.experiences.length === 0 ? (
            <div className="empty-state">
              <i
                className="fas fa-briefcase"
                style={{ fontSize: 2, color: "#cbd5e1", marginBottom: 8 }}
              ></i>
              <p>No experience entries yet.</p>
            </div>
          ) : (
            content.experiences.map((exp, i) => (
              <div className="project-item" key={i}>
                <div className="item-header">
                  <span className="item-index">
                    #{i + 1}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      const next = content.experiences.filter(
                        (_, j) => j !== i,
                      );
                      setContent((p) =>
                        p
                          ? { ...p, experiences: next }
                          : p,
                      );
                    }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) =>
                    setExperienceField(i, "title", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    setExperienceField(i, "company", e.target.value)
                  }
                />
                <div className="admin-field-row">
                  <input
                    className="admin-field-input"
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      setExperienceField(
                        i,
                        "location",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    className="admin-field-input"
                    type="text"
                    placeholder="Date"
                    value={exp.date}
                    onChange={(e) =>
                      setExperienceField(i, "date", e.target.value)
                    }
                  />
                </div>
                <textarea
                  placeholder="Responsibilities (one per line)"
                  value={exp.responsibilities.join("\n")}
                  onChange={(e) =>
                    setExperienceField(
                      i,
                      "responsibilities",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))
          )}

          <button
            className="add-item-btn"
            onClick={() => {
              if (!content) return;
              const next: typeof content = {
                ...content,
                experiences: [
                  ...content.experiences,
                  {
                    title: "New Job Title",
                    company: "Company Name",
                    location: "",
                    date: "Month Year",
                    responsibilities: [
                      "Responsibility 1",
                      "Responsibility 2",
                    ],
                  },
                ],
              };
              persist(next);
            }}
          >
            <i className="fas fa-plus"></i> Add Experience
          </button>

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save Experience
          </button>
        </div>

        {/* ===================== PROJECTS ===================== */}
        <div className="section-card" id="projects">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-code"></i> Projects
            </h3>
            <span className="section-badge">Work</span>
          </div>

          {content.projects.length === 0 ? (
            <div className="empty-state">
              <i
                className="fas fa-code"
                style={{ fontSize: 2, color: "#cbd5e1", marginBottom: 8 }}
              ></i>
              <p>No projects yet.</p>
            </div>
          ) : (
            content.projects.map((project, i) => (
              <div className="project-item" key={i}>
                <div className="item-header">
                  <span className="item-index">#{i + 1}</span>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      const next = content.projects.filter(
                        (_, j) => j !== i,
                      );
                      setContent((p) =>
                        p
                          ? { ...p, projects: next }
                          : p,
                      );
                    }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) =>
                    setProjectField(i, "title", e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={project.desc}
                  onChange={(e) =>
                    setProjectField(i, "desc", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Your Role"
                  value={project.role}
                  onChange={(e) =>
                    setProjectField(i, "role", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={project.tech.join(", ")}
                  onChange={(e) =>
                    setProjectField(i, "tech", e.target.value)
                  }
                />
              </div>
            ))
          )}

          <button
            className="add-item-btn"
            onClick={() => {
              if (!content) return;
              const next: typeof content = {
                ...content,
                projects: [
                  ...content.projects,
                  {
                    title: "New Project",
                    desc: "Description",
                    role: "Developer",
                    tech: ["HTML", "CSS"],
                  },
                ],
              };
              persist(next);
            }}
          >
            <i className="fas fa-plus"></i> Add Project
          </button>

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save Projects
          </button>
        </div>

        {/* ===================== SKILLS ===================== */}
        <div className="section-card" id="skills">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-cog"></i> Skills
            </h3>
            <span className="section-badge">Tech</span>
          </div>

          <label>Skills (comma separated)</label>
          <input
            type="text"
            value={content.skills.join(", ")}
            onChange={(e) =>
              setContent((prev) =>
                prev
                  ? {
                      ...prev,
                      skills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                    }
                  : prev,
              )
            }
            placeholder="JavaScript, React, Python…"
          />

          <div className="item-preview-list">
            {content.skills.map((s) => (
              <span className="item-preview-chip" key={s}>
                {s}
              </span>
            ))}
          </div>

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save Skills
          </button>
        </div>

        {/* ===================== COLORS ===================== */}
        <div className="section-card" id="colors">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-palette"></i> Colors
            </h3>
            <section className="section-badge">Theme</section>
          </div>

          <div className="color-picker-row">
            <label>Primary Color</label>
            <input
              type="color"
              value={content.colors.primary}
              onChange={(e) =>
                setContent((prev) =>
                  prev
                    ? {
                        ...prev,
                        colors: {
                          ...prev.colors,
                          primary: e.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
            <span className="color-preview">
              {content.colors.primary}
            </span>
          </div>

          <div className="color-picker-row">
            <label>Background Color</label>
            <input
              type="color"
              value={content.colors.bg}
              onChange={(e) =>
                setContent((prev) =>
                  prev
                    ? {
                        ...prev,
                        colors: {
                          ...prev.colors,
                          bg: e.target.value,
                        },
                      }
                    : prev,
                )
              }
            />
            <span className="color-preview">
              {content.colors.bg}
            </span>
          </div>

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Apply Colors
          </button>
        </div>

        {/* ===================== CV ===================== */}
        <div className="section-card" id="cv">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-file-pdf"></i> CV / Resume
            </h3>
            <span className="section-badge">Document</span>
          </div>

          {/* PDF upload widget */}
          <div className="pdf-upload-widget">
            <div className="pdf-icon">
              <i className="fas fa-file-pdf"></i>
            </div>
            <div className="pdf-info">
              <div className="pdf-label">CV PDF</div>
              <div className="pdf-filename">
                {content.cv.pdfUrl?.split("/").pop() ??
                  "No file uploaded"}
              </div>
              <div className="pdf-size">
                Click "Choose File" to upload a new PDF
              </div>
            </div>
            <div className="pdf-actions">
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                id="cvPdfInput"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                }}
              />
              <button
                className="choose-pdf-btn"
                onClick={() => {
                  const input =
                    document.getElementById(
                      "cvPdfInput",
                    ) as HTMLInputElement;
                  if (input) input.click();
                }}
              >
                <i className="fas fa-upload"></i> Choose PDF
              </button>
              <button
                className="save-pdf-btn"
                onClick={async () => {
                  const input =
                    document.getElementById(
                      "cvPdfInput",
                    ) as HTMLInputElement;
                  if (!input?.files?.[0]) {
                    showFlash(
                      "Please choose a PDF first.",
                      "error",
                    );
                    return;
                  }
                  try {
                    const url = await uploadPdf(input.files[0]);
                    if (!url) return;
                    // Persist the blob URL to the content store immediately
                    persist({
                      ...content,
                      cv: mergeCV(content.cv, { pdfUrl: url }),
                    });
                  } catch (err) {
                    showFlash(
                      (err as Error).message,
                      "error",
                    );
                  }
                }}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                Upload & Save
              </button>
            </div>
          </div>

          {/* Current PDF link preview */}
          {content.cv.pdfUrl && (
            <a
              href={content.cv.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                fontSize: "0.85rem",
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <i className="fas fa-external-link-alt"></i>
              View current PDF
            </a>
          )}

          <label>Profile Bio</label>
          <textarea
            value={content.cv.profile}
            onChange={(e) =>
              setCVField({ profile: e.target.value })
            }
            placeholder="Professional summary…"
          />

          <label>Stats</label>
          {content.cv.stats.map((stat, i) => (
            <div
              className="admin-field-row"
              key={i}
            >
              <input
                className="admin-field-input"
                type="text"
                placeholder="Label"
                value={stat.label}
                onChange={(e) =>
                  setCVStat(i, "label", e.target.value)
                }
              />
              <input
                className="admin-field-input"
                type="text"
                placeholder="Number"
                value={stat.number}
                onChange={(e) =>
                  setCVStat(i, "number", e.target.value)
                }
              />
              <button
                className="admin-field-remove"
                onClick={() => {
                  const next = content.cv.stats.filter(
                    (_, j) => j !== i,
                  );
                  setCVField({ stats: next });
                }}
                title="Remove stat"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}

          <div className="stat-preview-row">
            {content.cv.stats.map((s) => (
              <span
                className="stat-preview-chip"
                key={s.label}
              >
                <span className="stat-preview-number">
                  {s.number}
                </span>
                {" "}
                {s.label}
              </span>
            ))}
          </div>

          <button
            className="add-item-btn"
            onClick={() => {
              if (!content) return;
              const next: typeof content = {
                ...content,
                cv: mergeCV(content.cv, {
                  stats: [
                    ...content.cv.stats,
                    { label: "New Stat", number: "0" },
                  ],
                }),
              };
              persist(next);
            }}
          >
            <i className="fas fa-plus"></i> Add Stat
          </button>

          <div className="cv-education-row" style={{ marginTop: 14 }}>
            <label>Education</label>
            {content.cv.education.map((edu, i) => (
              <div
                className="admin-field-row"
                key={i}
              >
                <input
                  className="admin-field-input"
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    setCVEdu(i, "degree", e.target.value)
                  }
                />
                <input
                  className="admin-field-input"
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    setCVEdu(i, "institution", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button
            className="add-item-btn"
            onClick={() => {
              if (!content) return;
              const next: typeof content = {
                ...content,
                cv: mergeCV(content.cv, {
                  education: [
                    ...content.cv.education,
                    {
                      degree: "New Degree",
                      institution: "College",
                      date: "Year – Year",
                    },
                  ],
                }),
              };
              persist(next);
            }}
          >
            <i className="fas fa-plus"></i> Add Education
          </button>

          <div style={{ marginTop: 14 }}>
            <label>Languages</label>
            {content.cv.languages.entries.map((lang, i) => (
              <div
                className="admin-field-row"
                key={i}
              >
                <input
                  className="admin-field-input"
                  type="text"
                  placeholder="Language"
                  value={lang.language}
                  onChange={(e) =>
                    setCVLang(i, "language", e.target.value)
                  }
                />
                <input
                  className="admin-field-input"
                  type="text"
                  placeholder="Level"
                  value={lang.level}
                  onChange={(e) =>
                    setCVLang(i, "level", e.target.value)
                  }
                />
                <button
                  className="admin-field-remove"
                  onClick={() => {
                    const entries =
                      content.cv.languages.entries.filter(
                        (_, j) => j !== i,
                      );
                    setCVField({
                      languages: { entries },
                    });
                  }}
                  title="Remove language"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            className="add-item-btn"
            onClick={() => {
              if (!content) return;
              const entries =
                content.cv.languages.entries;
              const next: typeof content = {
                ...content,
                cv: mergeCV(content.cv, {
                  languages: {
                    entries: [
                      ...entries,
                      {
                        language: "New Language",
                        level: "Level",
                      },
                    ],
                  },
                }),
              };
              persist(next);
            }}
          >
            <i className="fas fa-plus"></i> Add Language
          </button>

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save CV
          </button>
        </div>

        {/* ===================== CONTACT ===================== */}
        <div className="section-card" id="contact">
          <div className="section-card-header">
            <h3>
              <i className="fas fa-envelope"></i> Contact
            </h3>
            <span className="section-badge">Reach</span>
          </div>

          <label>Email</label>
          <input
            type="text"
            value={content.contact.email}
            onChange={(e) =>
              setContactField("email", e.target.value)
            }
            placeholder="email@example.com"
          />

          <label>Phone</label>
          <input
            type="text"
            value={content.contact.phone}
            onChange={(e) =>
              setContactField("phone", e.target.value)
            }
            placeholder="+1 555 123 4567"
          />

          <label>GitHub</label>
          <input
            type="text"
            value={content.contact.github}
            onChange={(e) =>
              setContactField("github", e.target.value)
            }
            placeholder="github.com/username"
          />

          <label>LinkedIn</label>
          <input
            type="text"
            value={content.contact.linkedin}
            onChange={(e) =>
              setContactField("linkedin", e.target.value)
            }
            placeholder="linkedin.com/in/name"
          />

          <label>Twitter / X</label>
          <input
            type="text"
            value={content.contact.twitter}
            onChange={(e) =>
              setContactField("twitter", e.target.value)
            }
            placeholder="@handle"
          />

          <label>Telegram</label>
          <input
            type="text"
            value={content.contact.telegram}
            onChange={(e) =>
              setContactField("telegram", e.target.value)
            }
            placeholder="@username"
          />

          <button
            className="save-btn"
            onClick={() => {
              persist(content);
            }}
          >
            <i className="fas fa-save"></i> Save Contact
          </button>
        </div>
      </div>

      {flashMsg && (
        <div
          className={`save-flash ${flashMsg.type}`}
          key={flashMsg.text}
        >
          <i
            className={`fas ${
              flashMsg.type === "success"
                ? "fa-check-circle"
                : "fa-exclamation-circle"
            }`}
          ></i>
          {flashMsg.text}
        </div>
      )}
    </>
  );
}

