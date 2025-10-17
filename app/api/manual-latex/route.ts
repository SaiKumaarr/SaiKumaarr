import { NextResponse } from "next/server";
import JSZip from "jszip";

import type { ManualLatexResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_LATEX_SIZE = 200 * 1024; // 200KB, plenty for a single resume template.

const sanitizeFilename = (value: string | null | undefined): string => {
  const fallback = "manual-resume.tex";
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const safe = trimmed
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  const ensured = safe || "manual-resume";
  return ensured.endsWith(".tex") ? ensured : `${ensured}.tex`;
};

const buildZip = async (filename: string, latex: string): Promise<string> => {
  const zip = new JSZip();
  zip.file(filename, latex);
  zip.file(
    "README.txt",
    [
      "Manual LaTeX upload from ResumeTex",
      "-----------------------------------",
      "",
      "The LaTeX source you provided is stored in this archive.",
      `Primary file: ${filename}`,
      "",
      "Open the .tex file in your preferred LaTeX editor to continue editing, or compile it with your usual toolchain.",
    ].join("\n")
  );
  return zip.generateAsync({ type: "base64" });
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let latex = "";
    let filename = sanitizeFilename(formData.get("filename") as string | null | undefined);

    const latexFile = formData.get("latexFile");
    if (latexFile instanceof File) {
      if (latexFile.size > MAX_LATEX_SIZE) {
        return NextResponse.json({ error: "LaTeX file exceeds the 200KB limit." }, { status: 413 });
      }
      latex = await latexFile.text();
      filename = sanitizeFilename(latexFile.name);
    }

    if (!latex) {
      const latexText = formData.get("latex");
      if (typeof latexText === "string") {
        latex = latexText.trim();
      }
    }

    if (!latex) {
      return NextResponse.json({ error: "Provide LaTeX content via file upload or the text area." }, { status: 400 });
    }

    if (latex.length > MAX_LATEX_SIZE) {
      return NextResponse.json({ error: "LaTeX content exceeds the 200KB limit." }, { status: 413 });
    }

    const zipBase64 = await buildZip(filename, latex);
    const payload: ManualLatexResult = {
      latex,
      zipBase64,
      filename,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Manual LaTeX upload failed", error);
    return NextResponse.json({ error: "Failed to handle LaTeX upload." }, { status: 500 });
  }
}
