import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
};

const CATEGORIES = [
  {
    icon: "fa-code",
    title: "Programming Languages",
    chips: ["Java", "Python", "C++", "C#", "JavaScript", "PHP"],
  },
  {
    icon: "fa-laptop-code",
    title: "Frontend Development",
    chips: ["HTML5", "CSS3", "Bootstrap", "React", "Tailwind CSS"],
  },
  {
    icon: "fa-server",
    title: "Backend & Databases",
    chips: [
      "PHP",
      "Node.js",
      "Express.js",
      "MySQL",
      "PostgreSQL",
      "SQLite",
      "MongoDB",
    ],
  },
  {
    icon: "fa-cloud",
    title: "Cloud & DevOps",
    chips: ["AWS", "Microsoft Azure", "Google Cloud", "Firebase", "Docker"],
  },
  {
    icon: "fa-network-wired",
    title: "Networking",
    chips: [
      "TCP/IP",
      "DNS",
      "DHCP",
      "Routing",
      "Switching",
      "LAN Administration",
      "Network Troubleshooting",
    ],
  },
  {
    icon: "fa-mobile-alt",
    title: "Mobile Development",
    chips: ["Android Studio", "Flutter", "React Native"],
  },
  {
    icon: "fa-tools",
    title: "Development Tools",
    chips: [
      "Git",
      "GitHub",
      "VS Code",
      "Visual Studio",
      "Postman",
      "Figma",
      "Jira",
    ],
  },
  {
    icon: "fa-shield-alt",
    title: "Security & Best Practices",
    chips: [
      "OWASP",
      "Authentication",
      "Authorization",
      "Data Encryption",
      "Secure Coding",
    ],
  },
];

const STRENGTHS = [
  "Software Development",
  "Full-Stack Development",
  "Database Design",
  "Computer Networking",
  "Technical Support",
  "Problem Solving",
  "Teamwork",
  "Communication",
  "Adaptability",
  "Time Management",
  "Continuous Learning",
];

export default function SkillsPage() {
  return (
    <>
      <h2 className="section-title">
        <i className="fas fa-cog"></i> Technical Skills
      </h2>
      <div className="skill-grid">
        {CATEGORIES.map((category) => (
          <div className="skill-category" key={category.title}>
            <h3>
              <i className={`fas ${category.icon}`}></i> {category.title}
            </h3>
            <div className="chip-group">
              {category.chips.map((chip) => (
                <span className="chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="core-strengths">
        <h3>
          <i className="fas fa-star"></i> Core Strengths
        </h3>
        <div className="strength-list">
          {STRENGTHS.map((s) => (
            <span className="strength-tag" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}