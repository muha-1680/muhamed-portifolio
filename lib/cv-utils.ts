export interface EducationEntry {
  degree: string;
  institution: string;
  date: string;
}

export interface LanguagesContent {
  entries: { language: string; level: string }[];
}

export interface CVContent {
  pdfUrl: string;
  stats: { label: string; number: string }[];
  profile: string;
  education: EducationEntry[];
  languages: LanguagesContent;
}

export type CVStatField = "label" | "number";
export type CVEduField = "degree" | "institution" | "date";
export type CVLangField = "language" | "level";

/** Shallow merge a partial CV onto the existing CV (everything else stays). */
export function mergeCV(
  base: CVContent,
  patch: Partial<CVContent>,
): CVContent {
  return {
    ...base,
    ...patch,
    education:
      Array.isArray(patch.education) ? patch.education : base.education,
    languages: (patch.languages as LanguagesContent) ?? base.languages,
    stats: Array.isArray(patch.stats) ? patch.stats : base.stats,
    profile: patch.profile ?? base.profile,
    pdfUrl: patch.pdfUrl ?? base.pdfUrl,
  };
}
