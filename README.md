# ResumeTex

ResumeTex converts PDF resumes into clean, professional LaTeX documents and compiled PDFs. The project now runs on a TypeScript-based Next.js stack designed for quick deployments on Vercel with minimal setup.

## Recent Updates
- Rebuilt the entire application as a modern Next.js app with Tailwind CSS styling.
- Added a serverless API route that extracts PDF contents, calls Google Generative AI for optional tailoring, and renders LaTeX templates.
- Introduced multiple polished resume templates and a streamlined upload-to-download workflow in the UI.
- Configured ESLint with `next/core-web-vitals` rules and updated tooling to keep builds clean on CI.
- Simplified deployment with a ready-to-use `vercel.json` configuration and documented Hobby-tier hosting tips.

## Key Features
- Upload any PDF resume to receive both LaTeX source files and a compiled PDF download.
- Select from several templates optimized for different job profiles.
- Tailor content with AI by providing a job title and description (requires a Google Generative AI API key).
- Keep files private—processing happens in memory and temporary storage is automatically cleaned.

## Getting Started
1. Clone the repository and install dependencies with `npm install` (or your preferred package manager).
2. Copy `.env.example` to `.env.local` and add your Google Generative AI API key if you plan to use tailoring.
3. Run `npm run dev` to start the development server and open the guided upload flow at `http://localhost:3000`.

## Deploying on Vercel
- Import the repository into a free Vercel Hobby project.
- Add environment variables in the Vercel dashboard (`GOOGLE_API_KEY`, etc.) before triggering the first deploy.
- Vercel automatically builds the Next.js app and provisions the API route—no additional configuration is needed.
- Monitor build minutes and serverless function invocations occasionally to stay within free-tier limits.

## Tips
- Use well-structured PDF resumes (not scanned images) for best conversion results.
- Keep file sizes below 10 MB to avoid upload failures.
- Provide detailed job descriptions when using the tailored resume option for more accurate AI suggestions.

## License
ResumeTex is distributed under the MIT License. Contributions and feedback are welcome.
