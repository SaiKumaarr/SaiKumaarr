import { NextResponse } from "next/server";
import JSZip from "jszip";

import { buildResumeData } from "@/lib/resume";
import { tailorResumeWithAI } from "@/lib/ai";
import { resumeToPdf } from "@/lib/pdf";
import type { ProcessResult } from "@/lib/types";
import { DEFAULT_TEMPLATE_ID, getTemplate } from "@/templates";
import { extractTextFromPdf } from "@/lib/pdf-extract";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A PDF resume is required." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    const text = await extractTextFromPdf(buffer);
    const resume = buildResumeData(text || "");

    const templateId = (formData.get("template") as string) || DEFAULT_TEMPLATE_ID;
    const tailored = formData.get("tailored") === "true";
    const jobTitle = (formData.get("jobTitle") as string) || undefined;
    const jobDescription = (formData.get("jobDescription") as string) || undefined;

    const processed = tailored
      ? await tailorResumeWithAI(resume, { jobTitle, jobDescription })
      : resume;

    const template = getTemplate(templateId);
    const latex = template.render(processed);
    const pdfBuffer = await resumeToPdf(processed);

    const zip = new JSZip();
    zip.file("resume.tex", latex);
    zip.file("resume.pdf", pdfBuffer);
    const zipBase64 = await zip.generateAsync({ type: "base64" });

    const payload: ProcessResult = {
      latex,
      pdfBase64: pdfBuffer.toString("base64"),
      zipBase64,
      templateId: template.id,
      tailored,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Resume processing failed", error);
    return NextResponse.json({ error: "Failed to process resume." }, { status: 500 });
  }
}
