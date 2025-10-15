"use client";

import { useMemo, useState } from "react";
import { TEMPLATE_OPTIONS } from "@/lib/templates";
import type { ProcessResult } from "@/lib/types";

const FEATURES = [
  "AI-powered PDF to LaTeX conversion",
  "Multiple professional templates",
  "Role-specific tailoring with Google Generative AI",
  "Download LaTeX source and ready-to-send PDF",
  "Compact timeline template for experience-heavy resumes",
];

const LANGUAGE_BADGES = ["TypeScript", "JavaScript", "LaTeX", "CSS", "HTML"];

const HOW_IT_WORKS = [
  "Upload your current resume as a PDF.",
  "Choose a LaTeX template or keep the default.",
  "Optionally provide the target job title and description.",
  "Process the file and download your polished resume.",
];

const DownloadButton = ({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-600"
  >
    {label}
  </button>
);

const base64ToBlob = (base64: string, mime: string) => {
  const binary = typeof window === "undefined" ? "" : window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [templateId, setTemplateId] = useState<string>(TEMPLATE_OPTIONS[0]?.id ?? "classic");
  const [tailored, setTailored] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);

  const template = useMemo(
    () => TEMPLATE_OPTIONS.find((option) => option.id === templateId) || TEMPLATE_OPTIONS[0],
    [templateId]
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a PDF resume to convert.");
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const body = new FormData();
      body.append("resume", file);
      body.append("template", templateId);
      body.append("tailored", tailored ? "true" : "false");
      if (jobTitle) body.append("jobTitle", jobTitle);
      if (jobDescription) body.append("jobDescription", jobDescription);

      const response = await fetch("/api/process", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Failed to process resume." }));
        throw new Error(data.error || "Failed to process resume.");
      }

      const data = (await response.json()) as ProcessResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
      <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/40 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
            ResumeTex
          </span>
          <h1 className="text-4xl font-display font-semibold leading-tight text-white lg:text-5xl">
            AI-powered PDF to LaTeX resumes tailored for every job application.
          </h1>
          <p className="text-lg text-slate-300">
            Convert your existing resume into professional LaTeX templates in seconds. Optimise for specific roles and download both the LaTeX source and polished PDF—no LaTeX knowledge required.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-sky-200">
            {LANGUAGE_BADGES.map((language) => (
              <span
                key={language}
                className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 font-semibold uppercase tracking-wide"
              >
                {language}
              </span>
            ))}
          </div>
          <ul className="grid gap-3 text-sm text-slate-300">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200" htmlFor="resume">
                Upload your resume (PDF, max 10MB)
              </label>
              <input
                id="resume"
                name="resume"
                type="file"
                accept="application/pdf"
                required
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                }}
                className="w-full cursor-pointer rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
              {file ? (
                <p className="text-xs text-slate-400">Selected: {file.name}</p>
              ) : (
                <p className="text-xs text-slate-500">We never store your files—uploads are deleted after processing.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200" htmlFor="template">
                Choose a template
              </label>
              <select
                id="template"
                name="template"
                value={templateId}
                onChange={(event) => setTemplateId(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                {TEMPLATE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">{template?.description}</p>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-200">Tailor for a specific job</span>
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-sky-500"
                  checked={tailored}
                  onChange={(event) => setTailored(event.target.checked)}
                />
              </div>
              <p className="text-xs text-slate-400">
                Provide the role and description to optimise bullet points for Applicant Tracking Systems.
              </p>
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Job title (e.g. Senior Frontend Engineer)"
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  disabled={!tailored}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900/60"
                />
                <textarea
                  placeholder="Paste the job description"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  disabled={!tailored}
                  rows={4}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? "Processing..." : "Convert resume"}
            </button>
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </form>

          {result && (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200">
              <h3 className="text-base font-semibold text-white">Download your files</h3>
              <p className="text-xs text-slate-400">
                Template: {result.templateId.toUpperCase()} · {result.tailored ? "Tailored" : "Standard"} resume
              </p>
              <div className="flex flex-wrap gap-3">
                <DownloadButton
                  label="Download PDF"
                  disabled={!result}
                  onClick={() => result && triggerDownload(base64ToBlob(result.pdfBase64, "application/pdf"), "resume.pdf")}
                />
                <DownloadButton
                  label="Download LaTeX"
                  disabled={!result}
                  onClick={() =>
                    result &&
                    triggerDownload(
                      new Blob([result.latex], { type: "application/x-tex;charset=utf-8" }),
                      "resume.tex"
                    )
                  }
                />
                <DownloadButton
                  label="Download Zip"
                  disabled={!result}
                  onClick={() =>
                    result &&
                    triggerDownload(base64ToBlob(result.zipBase64, "application/zip"), "resume-bundle.zip")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {HOW_IT_WORKS.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 text-sm text-slate-300">
          <h3 className="text-lg font-semibold text-white">Privacy-first processing</h3>
          <p>
            Your files are processed in-memory and never stored at rest. Temporary artefacts are discarded immediately after the conversion completes.
          </p>
          <p>
            Need to tweak the result? Download the LaTeX source, make changes locally, and recompile with your favourite toolchain.
          </p>
        </div>
      </section>
    </main>
  );
}
