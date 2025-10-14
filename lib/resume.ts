import type { ResumeData, ResumeItem, ResumeSection } from "./types";

const SECTION_KEYWORDS: Record<string, string[]> = {
  summary: ["summary", "profile", "about"],
  experience: ["experience", "employment", "work history"],
  education: ["education", "academics", "study"],
  skills: ["skills", "technologies", "tools"],
  projects: ["projects", "portfolio"],
  certifications: ["certifications", "licenses"],
};

const LINK_REGEX = /(https?:\/\/[^\s]+)/gi;
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}/;

const normalise = (value: string): string => value.replace(/\s+/g, " ").trim();

const detectSection = (line: string): string | null => {
  const lower = line.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some((keyword) => lower.startsWith(keyword))) {
      return section;
    }
  }
  return null;
};

const chunkByEmptyLine = (lines: string[]): string[][] => {
  const chunks: string[][] = [];
  let current: string[] = [];
  lines.forEach((line) => {
    if (!line.trim()) {
      if (current.length) {
        chunks.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  });
  if (current.length) {
    chunks.push(current);
  }
  return chunks;
};

const buildItems = (chunks: string[][]): ResumeItem[] => {
  return chunks.map((chunk) => {
    const [firstLine = "", ...rest] = chunk;
    const parts = firstLine.split(/ [-\u2013\u2014] /);
    let title = parts[0];
    let subtitle = parts.slice(1).join(" – ");
    let date: string | undefined;

    if (subtitle && /\d{4}/.test(subtitle)) {
      const segments = subtitle.split(/\s{2,}|\|/);
      if (segments.length > 1) {
        date = segments.pop();
        subtitle = segments.join(" ");
      }
    }

    const bullets = rest
      .map((line) => line.replace(/^[-•\u2022]\s*/, ""))
      .filter(Boolean);

    return {
      title: normalise(title),
      subtitle: normalise(subtitle || ""),
      date: date ? normalise(date) : undefined,
      bullets,
    };
  });
};

const deduplicateLinks = (links: string[]): string[] => {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = link.replace(/[\s<>]/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildResumeData = (text: string): ResumeData => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line, index, arr) => line || (arr[index - 1] && arr[index - 1].trim() !== ""));

  const nonEmpty = lines.filter(Boolean);
  const name = normalise(nonEmpty[0] || "Your Name");
  const headline = normalise(nonEmpty[1] || "");

  const sectionContent: Record<string, string[]> = {};
  let currentSection: string | null = null;
  lines.forEach((line) => {
    const detected = detectSection(line);
    if (detected) {
      currentSection = detected;
      if (!sectionContent[currentSection]) {
        sectionContent[currentSection] = [];
      }
      return;
    }
    if (currentSection) {
      sectionContent[currentSection].push(line);
    }
  });

  const summary = normalise(sectionContent.summary?.join(" ") || "");
  const skills = sectionContent.skills
    ? sectionContent.skills
        .flatMap((line) =>
          line
            .split(/[•,]/)
            .map((skill) => normalise(skill))
            .filter(Boolean)
        )
    : [];

  const makeSection = (key: string, heading: string): ResumeSection | null => {
    const content = sectionContent[key];
    if (!content || !content.length) return null;
    return {
      heading,
      items: buildItems(chunkByEmptyLine(content)),
    };
  };

  const sections: ResumeSection[] = [];
  const experienceSection = makeSection("experience", "Experience");
  if (experienceSection) sections.push(experienceSection);
  const projectSection = makeSection("projects", "Projects");
  if (projectSection) sections.push(projectSection);
  const educationSection = makeSection("education", "Education");
  if (educationSection) sections.push(educationSection);
  const certificationSection = makeSection("certifications", "Certifications");
  if (certificationSection) sections.push(certificationSection);

  const combinedText = text;
  const emailMatch = combinedText.match(EMAIL_REGEX);
  const phoneMatch = combinedText.match(PHONE_REGEX);
  const links = deduplicateLinks((combinedText.match(LINK_REGEX) || []).map(normalise)).map((url) => ({
    label: url.replace(/https?:\/\//, ""),
    url,
  }));

  return {
    name,
    headline: headline && headline !== name ? headline : undefined,
    summary: summary || undefined,
    email: emailMatch ? normalise(emailMatch[0]) : undefined,
    phone: phoneMatch ? normalise(phoneMatch[0]) : undefined,
    location: undefined,
    sections,
    skills,
    links,
  };
};
