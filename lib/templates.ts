export interface TemplateOption {
  id: string;
  name: string;
  description: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Balanced two-column layout ideal for corporate and academic roles.",
  },
  {
    id: "minimal",
    name: "Minimal Modern",
    description: "Clean single-column layout with bold typography for tech roles.",
  },
  {
    id: "compact",
    name: "Compact Timeline",
    description: "Condensed layout with timeline headers for experience-heavy resumes.",
  },
];
