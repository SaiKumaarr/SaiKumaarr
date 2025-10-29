import Link from "next/link";

const palette = [
  {
    name: "Primary",
    light: "#4057FF",
    dark: "#8597FF",
    usage: "Calls-to-action, interactive accents",
  },
  {
    name: "Secondary",
    light: "#00C39A",
    dark: "#38E1B8",
    usage: "Data points, hover states, supporting accents",
  },
  {
    name: "Background",
    light: "#F5F7FB",
    dark: "#0E1117",
    usage: "Page backgrounds, neutral canvases",
  },
  {
    name: "Surface",
    light: "#FFFFFF",
    dark: "#141B2C",
    usage: "Cards, modals, interactive surfaces",
  },
  {
    name: "Typography",
    light: "#111827",
    dark: "#E6EDF3",
    usage: "Headings, body copy, high-contrast text",
  },
  {
    name: "Status",
    light: "#FFB020 / #FF5D5D",
    dark: "#FFB020 / #FF5D5D",
    usage: "Alerts, validation feedback, metrics chips",
  },
];

const sections = [
  {
    id: "who",
    title: "Hero · Who I Am",
    description:
      "Immersive hero that pairs a personal brand statement with animated identity moments.",
    highlights: [
      "Animated role ticker cycling through Product Strategist, AI Experimenter, Team Catalyst.",
      "Headshot framed by orbiting gradient ring and quick fact overlay on hover.",
      "Primary CTAs for viewing work and booking a strategy session.",
    ],
  },
  {
    id: "skills",
    title: "Skills & Expertise",
    description:
      "Tabbed skill system mapping proficiency levels to projects with interactive cards.",
    highlights: [
      "Segmented control for Technical, Product, AI/ML, and Soft skills.",
      "Radial proficiency meters with hover/tap flips for use cases.",
      "Dynamic project pills surfaced beneath the active tab.",
    ],
  },
  {
    id: "journey",
    title: "Professional Journey",
    description:
      "Timeline that visualizes 7-year trajectory with expandable achievement drawers.",
    highlights: [
      "Desktop horizontal timeline, mobile vertical stacking with sticky year labels.",
      "Logo monochrome badges that colorize on focus/hover.",
      "Modal overlays exposing KPIs, team size, and testimonial snippets.",
    ],
  },
  {
    id: "experiments",
    title: "AI Experiments Showcase",
    description:
      "Filterable gallery highlighting image generation, advanced prompting, and other prototypes.",
    highlights: [
      "Masonry grid with category filters and animated tags.",
      "Before/after sliders and prompt playground micro-app.",
      "Methodology tabs for context, outcomes, and resources.",
    ],
  },
  {
    id: "tools",
    title: "AI Tools & Technologies",
    description:
      "Logo-forward grid organized by capability pillars with proficiency overlays.",
    highlights: [
      "Carousel behaviour on mobile with swipe gestures.",
      "Proficiency badges paired with quick win statements.",
      "Filtering back to related experiments or timeline entries.",
    ],
  },
  {
    id: "contact",
    title: "Contact & Collaboration",
    description:
      "Conversion-focused contact section featuring multiple outreach paths and validation messaging.",
    highlights: [
      "Two-column layout with CTA narrative and accessible form stack.",
      "Inline validation with success confetti micro-interaction.",
      "LinkedIn, email, and Calendly quick links surfaced above the fold.",
    ],
  },
];

const Wireframe = ({ id }: { id: string }) => {
  switch (id) {
    case "who":
      return (
        <div className="relative grid h-72 grid-cols-1 gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-sky-500 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Hero Identity
            </span>
            <h3 className="text-2xl font-display text-white">Sai Kumar Basole</h3>
            <p className="max-w-sm text-sm text-slate-300">
              AI Product Manager with 7+ years orchestrating data-driven products from concept to scalable launch.
            </p>
            <div className="flex flex-wrap gap-2">
              {["View My Work", "Book a Strategy Session"].map((cta) => (
                <span
                  key={cta}
                  className="rounded-full bg-sky-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-200"
                >
                  {cta}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Animated role ticker · Reduced motion safe</span>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-sky-500/60 border-t-transparent" />
              <div className="absolute inset-2 rounded-full border border-slate-700 bg-slate-950" />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
            </div>
            <div className="absolute -bottom-6 right-0 w-40 rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-300">
              <p className="font-semibold text-sky-200">Quick Facts</p>
              <p>7+ yrs experience</p>
              <p>Responsible AI advocate</p>
            </div>
          </div>
        </div>
      );
    case "skills":
      return (
        <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-emerald-400">
          <div className="flex flex-wrap gap-2">
            {["Technical", "Product", "AI/ML", "Soft Skills"].map((tab, index) => (
              <span
                key={tab}
                className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                  index === 0 ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-800 text-slate-300"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {["Prompt Engineering", "Roadmapping", "LLM Orchestration", "Stakeholder Alignment"].map((skill) => (
              <div key={skill} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{skill}</p>
                  <p className="text-xs text-slate-400">Advanced · 5 yrs</p>
                </div>
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 rounded-full border border-slate-700" />
                  <div className="absolute inset-1 rounded-full border-4 border-emerald-400/80" />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-200">92%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-dashed border-emerald-400/40 bg-emerald-400/5 p-4 text-xs text-emerald-200">
            Hover to reveal use cases · Click to filter connected projects
          </div>
        </div>
      );
    case "journey":
      return (
        <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-sky-400">
          <div className="relative flex items-center gap-4 overflow-x-auto">
            {["2024", "2022", "2020", "2018"].map((year, index) => (
              <div key={year} className="flex min-w-[12rem] flex-col gap-2">
                <div className="relative flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full border border-slate-700 bg-slate-950">
                    <span className="absolute inset-1 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Role Title</p>
                    <p className="text-xs text-slate-400">Company · {year} – {index === 0 ? "Present" : `20${index * 2 + 16}`}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
                  <p className="font-semibold text-sky-200">Impact</p>
                  <p>↑ Adoption 35%</p>
                  <p>Launched 3 AI features</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
            Expand nodes for KPIs, testimonials, and tech stack. Mobile defaults to vertical stacking with sticky year chips.
          </div>
        </div>
      );
    case "experiments":
      return (
        <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-purple-400">
          <div className="flex flex-wrap gap-2">
            {["All", "Image Generation", "Advanced Prompting", "Other"].map((filter, index) => (
              <span
                key={filter}
                className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                  index === 0 ? "bg-purple-500/20 text-purple-200" : "bg-slate-800 text-slate-300"
                }`}
              >
                {filter}
              </span>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Before/After", "Prompt Chains", "Ops Automation"].map((card) => (
              <div key={card} className="relative h-40 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
                <p className="mb-2 font-semibold text-purple-200">{card}</p>
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Outcome</span>
                  <span>Method</span>
                </div>
                <div className="absolute inset-x-4 top-12 h-16 rounded-lg border border-dashed border-purple-400/50" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-dashed border-purple-400/50 bg-purple-500/10 p-4 text-xs text-purple-200">
            Includes interactive prompt tester with pre-computed responses.
          </div>
        </div>
      );
    case "tools":
      return (
        <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-amber-400">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["OpenAI", "Midjourney", "LangChain", "Pinecone", "Mixpanel", "Figma"].map((tool) => (
              <div key={tool} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-amber-200">{tool}</span>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 font-semibold text-amber-200">Expert</span>
                </div>
                <div className="h-16 rounded-lg border border-dashed border-amber-400/50 bg-amber-400/5" />
                <p className="text-xs text-slate-400">Used for rapid experimentation and measuring impact.</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-xs text-amber-200">
            Swipe-enabled carousel on mobile with auto-play toggle.
          </div>
        </div>
      );
    case "contact":
      return (
        <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/50 transition hover:border-emerald-300 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Collaboration CTA</p>
            <h4 className="text-2xl font-display text-white">Let’s build responsible AI experiences together.</h4>
            <p className="text-sm text-slate-300">
              Multiple contact pathways supported: email, LinkedIn, and calendar booking. Form integrates spam protection and realtime validation.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-emerald-200">
              <span className="rounded-full border border-emerald-300/60 px-3 py-1">LinkedIn</span>
              <span className="rounded-full border border-emerald-300/60 px-3 py-1">Email</span>
              <span className="rounded-full border border-emerald-300/60 px-3 py-1">Calendly</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">Name</label>
              <div className="h-9 rounded-md border border-slate-700 bg-slate-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">Email</label>
              <div className="h-9 rounded-md border border-slate-700 bg-slate-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">Project Type</label>
              <div className="h-9 rounded-md border border-slate-700 bg-slate-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">Message</label>
              <div className="h-16 rounded-md border border-slate-700 bg-slate-900" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Validation ready · WCAG AA compliant</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                Submit
              </span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function MockupsPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(64,87,255,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,195,154,0.25),_transparent_55%)]" />
      <header className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Visual Mockups</p>
        <h1 className="text-4xl font-display text-white md:text-5xl">AI Product Manager Portfolio Experience</h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300">
          High-fidelity wireframes and UI direction for a modern, interactive portfolio showcasing Sai Kumar Basole’s AI product leadership. Built for responsive delivery, accessibility, and motion-enhanced storytelling.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 px-3 py-1">Responsive · Desktop / Tablet / Mobile</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">WCAG AA Accessible</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">Light & Dark Modes</span>
        </div>
      </header>

      <section className="grid gap-8 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-xl shadow-slate-950/40">
        <div className="space-y-4">
          <h2 className="text-2xl font-display text-white">Visual Language</h2>
          <p className="max-w-2xl text-sm text-slate-300">
            The design system pairs confident gradients with high-contrast typography to align with AI innovation while staying recruitment-ready. Provide a mode toggle for instant light/dark transitions with preserved contrast ratios.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Color Palette</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {palette.map((swatch) => (
                <div key={swatch.name} className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-100">{swatch.name}</span>
                    <span>{swatch.usage}</span>
                  </div>
                  <div className="flex h-16 overflow-hidden rounded-xl">
                    <div className="flex-1" style={{ backgroundColor: swatch.light }} />
                    <div className="flex-1" style={{ backgroundColor: swatch.dark }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <span>Light: {swatch.light}</span>
                    <span>Dark: {swatch.dark}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Typography</h3>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Display / H1 · Space Grotesk 700</p>
              <p className="text-3xl font-display text-white">Design AI experiences that empower people.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Body · Inter 400</p>
              <p className="text-sm text-slate-300">
                Crafted narrative structure with a 4px baseline grid, 70ch line length, and responsive scaling from desktop to mobile. Inputs and code references rely on JetBrains Mono for clarity.
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-sky-400/50 bg-sky-500/10 p-4 text-xs text-sky-100">
              Include font loading strategies via Next.js with `next/font` to optimize CLS.
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        {sections.map((section) => (
          <article key={section.id} className="grid gap-6 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-xl shadow-slate-950/40">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl space-y-2">
                <h2 className="text-2xl font-display text-white">{section.title}</h2>
                <p className="text-sm text-slate-300">{section.description}</p>
              </div>
              <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Interaction Notes</p>
                <ul className="space-y-2">
                  {section.highlights.map((note) => (
                    <li key={note} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Wireframe id={section.id} />
          </article>
        ))}
      </section>

      <footer className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-xs text-slate-400 md:flex-row md:text-left">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Implementation Tips</p>
          <p className="max-w-2xl text-slate-300">
            Leverage Next.js App Router with Framer Motion for scroll-triggered animations, Tailwind for rapid styling, and Sanity CMS for content agility. Respect prefers-reduced-motion and provide keyboard operability for every interactive element.
          </p>
        </div>
        <Link
          href="https://www.linkedin.com/in/saikumarbasole"
          target="_blank"
          className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
        >
          View LinkedIn Profile
        </Link>
      </footer>
    </main>
  );
}
