export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeItem {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface ResumeSection {
  heading: string;
  items: ResumeItem[];
}

export interface ResumeData {
  name: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  sections: ResumeSection[];
  skills: string[];
  links: ResumeLink[];
}

export interface TailorRequest {
  jobTitle?: string;
  jobDescription?: string;
}

export interface ProcessResult {
  latex: string;
  pdfBase64: string;
  zipBase64: string;
  templateId: string;
  tailored: boolean;
}
