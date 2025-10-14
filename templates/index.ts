import { TEMPLATE_OPTIONS } from "@/lib/templates";
import type { ResumeData } from "@/lib/types";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  render: (data: ResumeData) => string;
}

const escapeLatex = (value?: string): string => {
  if (!value) return "";
  return value
    .replace(/\\/g, "\\textbackslash{}");
};

const sanitize = (value?: string): string => {
  if (!value) return "";
  return escapeLatex(value)
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}");
};

const sanitizeInline = (value?: string): string => {
  return sanitize(value).replace(/\^/g, "\\textasciicircum{}");
};

const formatLinks = (links: ResumeData["links"]): string => {
  if (!links.length) return "";
  const items = links
    .map((link) => `\\href{${link.url}}{${sanitizeInline(link.label || link.url)}}`)
    .join(" \\quad ");
  return `\\vspace{0.5em}\\\n{\\small ${items}}`;
};

const formatSkills = (skills: string[]): string => {
  if (!skills.length) return "";
  return [
    "\\section*{Skills}",
    `\\begin{itemize}[leftmargin=*]`,
    skills.map((skill) => `  \\item ${sanitizeInline(skill)}`).join("\\n"),
    "\\end{itemize}",
  ].join("\\n");
};

const formatSections = (data: ResumeData): string => {
  return data.sections
    .map((section) => {
      const items = section.items
        .map((item) => {
          const header = [
            item.title ? `\\textbf{${sanitizeInline(item.title)}}` : "",
            item.subtitle ? `\\textit{${sanitizeInline(item.subtitle)}}` : "",
            item.date ? `\\hfill ${sanitizeInline(item.date)}` : "",
          ]
            .filter(Boolean)
            .join(" \\quad ");

          const bullets = (item.bullets || []).length
            ? [
                "\\begin{itemize}[leftmargin=*]",
                ...(item.bullets || []).map((bullet) => `  \\item ${sanitizeInline(bullet)}`),
                "\\end{itemize}",
              ].join("\\n")
            : item.description
            ? sanitizeInline(item.description)
            : "";

          return [header, bullets].filter(Boolean).join("\\n");
        })
        .join("\\n\\medskip\\n");

      return [`\\section*{${sanitizeInline(section.heading)}}`, items].join("\\n");
    })
    .join("\\n\\bigskip\\n");
};

const renderClassic = (data: ResumeData): string => {
  const summary = data.summary
    ? `\\section*{Summary}\\n${sanitizeInline(data.summary)}`
    : "";

  return `\\documentclass[10pt,a4paper]{article}
\\usepackage[margin=1.2cm]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{multicol}
\\usepackage{parskip}
\\titleformat{\\section}{\\large\\bfseries}{ }{0pt}{ }
\\begin{document}
\\begin{center}
  {\\huge ${sanitizeInline(data.name)}}\\\\
  ${sanitizeInline(data.headline)}\\\\
  {\\small ${[sanitizeInline(data.email), sanitizeInline(data.phone), sanitizeInline(data.location)]
    .filter(Boolean)
    .join(" \\quad ")}}
\\end{center}
${formatLinks(data.links)}
\\medskip
${summary}
${formatSkills(data.skills)}
${formatSections(data)}
\\end{document}`;
};

const renderMinimal = (data: ResumeData): string => {
  const summaryBlock = data.summary
    ? `\\begin{flushleft}\\textit{${sanitizeInline(data.summary)}}\\end{flushleft}`
    : "";

  return `\\documentclass[10pt]{article}
\\usepackage[a4paper,margin=1.4cm]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{parskip}
\\renewcommand{\\familydefault}{\\sfdefault}
\\begin{document}
\\noindent{\\LARGE\\bfseries ${sanitizeInline(data.name)}}\\\\
{\\large ${sanitizeInline(data.headline)}}\\\\[4pt]
${[sanitizeInline(data.email), sanitizeInline(data.phone), sanitizeInline(data.location)]
    .filter(Boolean)
    .join(" \\textbullet{} ")}
\\\n${formatLinks(data.links)}
\\medskip
${summaryBlock}
\\medskip
${formatSections(data)}
\\medskip
${formatSkills(data.skills)}
\\end{document}`;
};

export const TEMPLATES: Record<string, TemplateDefinition> = Object.fromEntries(
  TEMPLATE_OPTIONS.map((option) => [
    option.id,
    {
      ...option,
      render: option.id === "minimal" ? renderMinimal : renderClassic,
    },
  ])
);

export const DEFAULT_TEMPLATE_ID = TEMPLATE_OPTIONS[0]?.id ?? "classic";

export const getTemplate = (id: string): TemplateDefinition => {
  return TEMPLATES[id] ?? TEMPLATES[DEFAULT_TEMPLATE_ID];
};
