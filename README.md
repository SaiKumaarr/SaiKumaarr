# Saikumar ResumeTex

ResumeTex transforms PDF resumes into clean LaTeX documents that you can download alongside a ready-to-send PDF. The app runs entirely in the browser and lightweight serverless functions, so it is fast to deploy and easy to maintain.

## Key Features
- Upload any PDF resume and receive a LaTeX version plus a compiled PDF.
- Choose from multiple professional templates, including a compact timeline layout for experience-heavy resumes.
- Optionally tailor the resume with Google Generative AI using your job description.
- Upload LaTeX resumes directly to package and download them without converting from PDF.
- Files are processed in-memory for a privacy-friendly workflow.

## Technology Stack
- **TypeScript & JavaScript** for type-safe, modern application logic.
- **Next.js & React** to power the interactive resume conversion workflow.
- **Tailwind CSS** for rapid, responsive styling.
- **PDFKit & JSZip** to generate polished PDFs and downloadable bundles.

## Languages
- TypeScript
- JavaScript
- LaTeX
- CSS
- HTML

## Getting Started
1. Clone the repository and install dependencies with your preferred package manager.
2. Create a local environment file (for example .env.local) if you want to use AI tailoring and add your Google Generative AI API key.
3. Run the development server to try the upload and conversion flow locally.

## Deploying on Vercel
- Import the repository into Vercel using a free Hobby account.
- Set any required environment variables in the Vercel dashboard before deploying.
- Trigger a deployment; Vercel will automatically build and host the app.

## Deploying from GitHub
- Commit your changes to a GitHub repository or fork and push this project to your account.
- Configure the included GitHub Actions workflow by adding `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets (available from the Vercel dashboard).
- Push to the `main` branch or run the workflow manually to lint, build, and deploy through Vercel using your GitHub automation.

## Tips
- Use well-structured resumes for the best conversion results.
- Keep file sizes under 10 MB to avoid upload issues.
- Monitor Vercel usage occasionally to stay within the free tier limits.

