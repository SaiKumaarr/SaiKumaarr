# ResumeTex

ResumeTex converts existing PDF resumes into polished LaTeX templates with the help of AI. Upload a resume, optionally supply a job description for tailoring, and download both the LaTeX source and a ready-to-send PDF. The project is optimised for deployment on [Vercel](https://vercel.com) using the Next.js App Router.

## Features
- AI-assisted PDF to LaTeX conversion with Google Generative AI tailoring
- Multiple LaTeX templates with downloadable source files
- Instant PDF rendering powered by serverless functions
- Privacy-first processing — files are handled in-memory and never stored

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Google Generative AI API key (optional, required for tailored resumes)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file and set the following (optional) variables:

```
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
GOOGLE_GENAI_MODEL=models/gemini-1.5-flash
```

If the API key is not provided the app will still convert PDFs but will skip AI-based tailoring.

### Production Build

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Create a new Vercel project and import the repository.
3. Set the environment variables from above in the Vercel dashboard.
4. Deploy — Vercel will run `npm install` and `npm run build` automatically using the configuration in `vercel.json`.

### Staying on the Free (Hobby) Tier

Vercel’s Hobby plan is free and works well for this project. To keep the deployment free of charge:

1. **Use the Hobby team** — when creating the project choose the default personal account instead of a paid team.
2. **Limit background jobs** — this app uses serverless functions that only run on demand, so no extra configuration is required. Avoid adding long-running cron jobs that could exceed free tier limits.
3. **Configure environment variables once** — in the Vercel dashboard navigate to _Settings → Environment Variables_ and add the optional `GOOGLE_GENERATIVE_AI_API_KEY` and `GOOGLE_GENAI_MODEL`. Leave them blank if you do not need AI tailoring.
4. **Trigger manual redeploys sparingly** — each push creates a new build. The free tier includes generous build minutes, but batching changes reduces unnecessary usage.
5. **Monitor usage** — the Vercel dashboard’s _Usage_ tab shows bandwidth and execution metrics. The default configuration of this app stays comfortably within the Hobby limits for light-to-moderate traffic.

If you later need custom domains or higher limits you can upgrade without changing the codebase.

## Project Structure

```
app/                 # Next.js App Router pages and API routes
lib/                 # Resume parsing, AI helpers, and PDF utilities
templates/           # LaTeX templates
public/              # Static assets (if required)
```

## License

This project is released under the MIT License.
