# ResumeTex Clone - AI-Powered PDF to LaTeX Resume Converter

## 1. Product Overview
ResumeTex Clone is a full-stack web platform that transforms existing PDF resumes into professionally formatted LaTeX resumes using AI-assisted structuring. Users can upload a PDF resume, select a LaTeX template, optionally provide a target job description for tailoring, and then download both the generated `.tex` source and the compiled `.pdf` output.

**Core goals**
- Increase resume conversion accuracy through PDF parsing + AI cleanup.
- Provide customizable LaTeX templates that enforce consistent design.
- Deliver a secure, reliable experience with minimal manual formatting.

---

## 2. High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                              Frontend (React)                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Upload Resume │ Template Picker │ Job Description │ Output Viewer │ │
│ └───────────────┴────────────────┴────────────────┴───────────────┘ │
└───────────────▲─────────────────────────────────────────────────────┘
                │ REST/GraphQL (HTTPS, JWT)                                     
┌───────────────┴─────────────────────────────────────────────────────┐
│                        Backend API (Node.js/Express)               │
│  ┌─────────────┐  ┌───────────────────┐  ┌────────────────────┐    │
│  │Upload Ctrl. │→ │ Resume Pipeline   │→│ Output Controller  │    │
│  └─────────────┘  └─────────▲─────────┘  └──────────▲─────────┘    │
│                              │                      │              │
│                    ┌─────────┴─────────┐            │              │
│                    │ AI StructuringSvc │            │              │
│                    └───────▲───────────┘            │              │
│                            │                        │              │
│  ┌──────────────────────────┴───────┐   ┌───────────┴──────────┐   │
│  │ PDF Parsing Service              │   │ LaTeX Template Engine │   │
│  │ (pdf-parse/pdfjs-dist)           │   │ (Handlebars + node-   │   │
│  │                                   │   │ latex)                │   │
│  └───────────────────────────────────┘   └──────────────────────┘   │
│                                                                       │
│   File Storage (tmpfs/S3)  │  Queue/Workers (BullMQ)  │  Monitoring    │
└────────────────────────────┴──────────────────────────┴────────────────┘
                │
                ▼
      Persistent Storage (PostgreSQL for audit/config, Redis for jobs)
```

**Request Lifecycle**
1. **Upload**: Client posts a PDF (and optional job description) to `/api/uploads`.
2. **Parsing**: Backend extracts raw text and layout markers.
3. **AI Structuring**: Parsed data + job description feed into LLM to normalize into a resume schema.
4. **LaTeX Generation**: Structured data is injected into a template, producing `.tex`.
5. **Compilation**: `.tex` compiles to PDF via `node-latex`.
6. **Delivery**: API returns download URLs for `.tex` and `.pdf`; temp files auto-expire.

---

## 3. Recommended File & Folder Structure
```
resumetex-clone/
├── packages/
│   ├── web/                         # React + Tailwind frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── UploadPanel.tsx
│   │   │   │   ├── TemplateCarousel.tsx
│   │   │   │   ├── JobDescriptionDrawer.tsx
│   │   │   │   ├── PreviewPane.tsx
│   │   │   │   └── DownloadButtons.tsx
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   │   └── ResumeWizard.tsx
│   │   │   ├── lib/api.ts
│   │   │   └── styles/index.css
│   │   └── tailwind.config.js
│   └── server/                      # Node/Express backend
│       ├── src/
│       │   ├── app.ts
│       │   ├── routes/
│       │   │   ├── upload.routes.ts
│       │   │   ├── templates.routes.ts
│       │   │   └── jobs.routes.ts
│       │   ├── controllers/
│       │   │   ├── upload.controller.ts
│       │   │   ├── resume.controller.ts
│       │   │   └── templates.controller.ts
│       │   ├── services/
│       │   │   ├── pdf-parser.service.ts
│       │   │   ├── ai-structuring.service.ts
│       │   │   ├── latex-generator.service.ts
│       │   │   ├── pdf-compiler.service.ts
│       │   │   └── storage.service.ts
│       │   ├── jobs/
│       │   │   └── resume-pipeline.worker.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   ├── env.ts
│       │   │   └── error-handler.ts
│       │   ├── templates/
│       │   │   ├── modern/
│       │   │   │   ├── main.tex.hbs
│       │   │   │   └── partials/
│       │   │   ├── classic/
│       │   │   └── creative/
│       │   └── types/
│       │       └── resume.ts
│       └── package.json
├── shared/
│   └── schema/                       # Zod/TypeScript types shared across apps
├── scripts/
│   └── cleanup-temp-files.ts
└── docker/
    ├── web.Dockerfile
    ├── server.Dockerfile
    └── docker-compose.yml
```

---

## 4. Key Components & Responsibilities
### Backend
- **Upload Controller**: Validates multipart form data, stores temp files, enqueues resume processing job.
- **Resume Pipeline Worker**: Orchestrates parsing → AI structuring → templating → compilation.
- **PDF Parser Service**: Extracts raw text, layout hints, and embedded metadata from PDFs.
- **AI Structuring Service**: Normalizes raw data into a canonical resume schema and handles job-tailored adjustments.
- **LaTeX Generator Service**: Injects structured data into Handlebars templates and ensures LaTeX escaping.
- **PDF Compiler Service**: Compiles `.tex` via `node-latex`/`tectonic` with retry logic and instrumentation.
- **Storage Service**: Manages temporary storage (local tmp directory or S3) with signed URLs and cleanup cron.

### Frontend
- **ResumeWizard Page**: Multi-step interface for upload, template selection, tailoring, and preview/download.
- **UploadPanel**: Handles drag-and-drop uploads, client-side validation, progress indicators.
- **TemplateCarousel**: Displays LaTeX template thumbnails with metadata and selection state.
- **JobDescriptionDrawer**: Optional input field with AI prompt suggestions and word count.
- **PreviewPane**: Renders low-res preview (using compiled PDF via `<embed>` or image snapshots).
- **DownloadButtons**: Offers `.tex` and `.pdf` downloads once processing completes.

---

## 5. Pipeline Workflow
1. **Client Upload**: `POST /api/resumes` with `multipart/form-data` containing `resume` (PDF), `templateId`, and optional `jobDescription`.
2. **Validation & Storage**: Backend validates MIME type/size, stores file in a `tmp` bucket, returns job ID.
3. **Queue Processing**: Worker dequeues job, runs parsing and AI structuring in isolated temp directories.
4. **AI Tailoring**: AI structuring service merges job keywords into experience bullets.
5. **Rendering**: LaTeX generator chooses template partials (skills, experience, education) and produces `resume.tex`.
6. **Compilation**: `node-latex` compiles to PDF; logs and metrics stored.
7. **Delivery**: Job status endpoint returns signed URLs; files auto-delete after TTL (e.g., 1 hour).

---

## 6. Implementation Snippets
### 6.1 PDF Parsing (`pdf-parser.service.ts`)
```ts
import { readFile } from 'node:fs/promises';
import pdfParse from 'pdf-parse';
import { PdfParseResult } from '../types/resume';

export async function parsePdf(filePath: string): Promise<PdfParseResult> {
  const fileBuffer = await readFile(filePath);
  const data = await pdfParse(fileBuffer, {
    pagerender: (pageData) => pageData.getTextContent({ normalizeWhitespace: true })
  });

  return {
    text: data.text,
    numPages: data.numpages,
    info: data.info,
    metadata: data.metadata?._metadata ?? {},
    version: data.version
  };
}
```
- Use `pdfjs-dist` if layout fidelity is required (extract coordinates). Combine with `pdf2json` for tables.

### 6.2 AI Structuring Service (`ai-structuring.service.ts`)
```ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuredResume, PdfParseResult } from '../types/resume';
import { buildStructuringPrompt } from '../utils/prompts';

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY! });
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function structureResume(
  pdfData: PdfParseResult,
  jobDescription?: string
): Promise<StructuredResume> {
  const prompt = buildStructuringPrompt(pdfData.text, jobDescription);
  const response = await model.generateContent(prompt);
  const json = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!json) throw new Error('Empty response from AI');

  return JSON.parse(json) as StructuredResume;
}
```

`StructuredResume` schema example:
```ts
export interface StructuredResume {
  basics: { name: string; email: string; phone?: string; location?: string; links?: string[] };
  summary?: string;
  experience: Array<{
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: string[];
  projects?: Array<{ name: string; description: string; url?: string }>;
  certifications?: string[];
}
```

### Prompt Builder (`utils/prompts.ts`)
```ts
export function buildStructuringPrompt(text: string, jobDescription?: string) {
  return [
    {
      role: 'system',
      content: `You are an expert resume analyst. Return valid JSON that fits the provided TypeScript interface.`
    },
    {
      role: 'user',
      content: `Extract structured resume data from the following PDF text. ${
        jobDescription
          ? `Tailor bullet points to emphasize alignment with this job description:\n${jobDescription}`
          : ''
      }\nResume PDF text:\n${text}`
    },
    {
      role: 'assistant',
      content: `{
  "basics": {"name": "", "email": ""},
  "summary": "",
  "experience": [],
  "education": [],
  "skills": []
}`
    }
  ];
}
```

- Alternative: Use OpenAI `gpt-4.1` with structured output or JSON schema.
- Post-process with Zod to validate and correct missing fields.

### 6.3 LaTeX Generation (`latex-generator.service.ts`)
```ts
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import { StructuredResume } from '../types/resume';
import { escapeLatex } from '../utils/latex';

Handlebars.registerHelper('latexEscape', escapeLatex);
Handlebars.registerHelper('joinSkills', (skills: string[]) => skills.join(' \textbullet\ '));

export async function generateLatex(
  resume: StructuredResume,
  templateId: string
): Promise<string> {
  const templatePath = `./templates/${templateId}/main.tex.hbs`;
  const template = await readFile(templatePath, 'utf8');
  const compiled = Handlebars.compile(template, { noEscape: true });
  return compiled({ resume });
}
```

`utils/latex.ts`:
```ts
const replacements: Record<string, string> = {
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '\\': '\\textbackslash{}'
};

export function escapeLatex(value: string): string {
  return value.replace(/[&%$#_{}~^\\]/g, (match) => replacements[match] ?? match);
}
```

### 6.4 PDF Compilation (`pdf-compiler.service.ts`)
```ts
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import latex from 'node-latex';
import { randomUUID } from 'node:crypto';
import { getTempDir } from '../utils/storage';

export async function compileLatex(texSource: string) {
  const workDir = await getTempDir();
  const texPath = join(workDir, `resume-${randomUUID()}.tex`);
  await fs.promises.writeFile(texPath, texSource, 'utf8');

  return new Promise<{ texPath: string; pdfPath: string }>((resolve, reject) => {
    const pdfPath = texPath.replace(/\.tex$/, '.pdf');
    const output = createWriteStream(pdfPath);
    const pdf = latex(texSource, { inputs: [workDir], passes: 2 });

    pdf.pipe(output);
    pdf.on('error', reject);
    output.on('finish', () => resolve({ texPath, pdfPath }));
  });
}
```
- Consider using `tectonic` CLI via child process for faster compilation and dependency caching.
- Capture compilation logs; surface errors back to client.

### 6.5 Storage & Cleanup (`storage.service.ts`)
```ts
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const TEMP_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function storeTemporaryFile(buffer: Buffer, extension: string) {
  const dir = join(tmpdir(), 'resumetex');
  await fs.mkdir(dir, { recursive: true });
  const filePath = join(dir, `${randomUUID()}.${extension}`);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

export async function cleanupExpiredFiles() {
  const dir = join(tmpdir(), 'resumetex');
  const files = await fs.readdir(dir);
  const now = Date.now();

  await Promise.all(
    files.map(async (file) => {
      const filePath = join(dir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > TEMP_TTL_MS) {
        await fs.unlink(filePath);
      }
    })
  );
}
```
- Use `cron`/`node-cron` or container `tmpfs` with TTL. For cloud, prefer S3 with lifecycle rules.

---

## 7. Integrating AI Tailoring
### Example Prompt (OpenAI)
```
System: You are an expert resume writer. Produce JSON matching the provided schema.
User: Given the raw resume text (between <resume></resume>) and the target job description (between <job></job>), rewrite experience bullets to emphasize impact and keywords. Keep facts accurate. Return minified JSON.
<resume>
${parsedText}
</resume>
<job>
${jobDescription}
</job>
Schema:
${jsonSchema}
```

### Post-processing
1. Validate JSON with Zod. If parsing fails, re-prompt the LLM with error summary.
2. Score alignment with TF-IDF/semantic similarity to confirm tailoring effectiveness.
3. Optionally store AI reasoning trace for audit.

---

## 8. Resume Template Suggestions
- **Modern Professional**: Single-column header + two-column body, accent color, icons for contact links.
- **Classic Serif**: Traditional layout using `
\documentclass{article}` with a sidebar for skills.
- **Creative Timeline**: Horizontal timeline for experience, ideal for designers.
- **Compact ATS-Friendly**: Plain text-friendly layout with minimal styling for Applicant Tracking Systems.
- **Academic CV**: Multi-page support with publications and teaching sections.

Each template resides in `templates/<name>/` with partials for sections (e.g., `_experience.tex.hbs`). Provide metadata (name, description, screenshot) stored in `templates.json` for frontend display.

---

## 9. Security & Best Practices
- Enforce authentication (JWT/OAuth) for persistent accounts; allow anonymous usage with rate limits.
- Validate file uploads (MIME, size, antivirus scanning via ClamAV or third-party). Reject non-PDF.
- Process AI calls server-side; never expose API keys to frontend.
- Sanitize AI output and escape LaTeX to prevent injection.
- Use HTTPS, secure cookies, and CSRF protections.
- Audit logging for conversions; anonymize or purge PII after TTL.

---

## 10. Observability & Deployment
- **Logging**: Use pino/winston with structured logs; ship to ELK or Stackdriver.
- **Metrics**: Expose Prometheus metrics (conversion duration, AI cost, errors).
- **Tracing**: OpenTelemetry for distributed tracing across API + worker.
- **Deployment**: Dockerize frontend/backend. Use Kubernetes or serverless (Cloud Run) with separate queues (Cloud Tasks/BullMQ).
- **CI/CD**: Linting (`eslint`, `prettier`), testing (Jest, Playwright), security scans (npm audit, Snyk).

---

## 11. Future Enhancements
- Allow users to edit structured data before compiling.
- Provide multilingual support and translation.
- Offer analytics on keyword alignment, skill gaps, and tailored cover letters.
- Integrate with job boards (Greenhouse, Lever) for one-click applications.

---

## 12. Running Locally (Conceptual)
```bash
# Backend
cd packages/server
cp .env.example .env
pnpm install
pnpm dev

# Frontend
cd packages/web
pnpm install
pnpm dev
```

Use `docker-compose` to start services: Postgres, Redis, and the server + web containers.

---

This blueprint captures the architecture, modules, and core implementations needed to build a production-ready ResumeTex clone.
