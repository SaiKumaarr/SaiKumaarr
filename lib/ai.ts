import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ResumeData, TailorRequest } from "./types";

const DEFAULT_MODEL = process.env.GOOGLE_GENAI_MODEL || "gemini-1.5-flash";

const parseJson = (payload: string) => {
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

export const tailorResumeWithAI = async (
  resume: ResumeData,
  request: TailorRequest
): Promise<ResumeData> => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || (!request.jobDescription && !request.jobTitle)) {
    return resume;
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: DEFAULT_MODEL });

  const prompt = `You are a professional technical recruiter.
Given the resume data in JSON format and an optional job description, tailor the achievements and summary to emphasise the most relevant experience.
Do not invent new roles or companies, but you may rephrase bullet points for clarity.
Respond with JSON containing keys: summary (string), sections (array of {heading, items:[{title, subtitle, date, bullets[]}]}), and skills (array of strings).`;

  const resumePayload = {
    summary: resume.summary,
    sections: resume.sections,
    skills: resume.skills,
  };

  const jobInfo = {
    title: request.jobTitle,
    description: request.jobDescription,
  };

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { text: `RESUME_DATA:\n${JSON.stringify(resumePayload, null, 2)}` },
            { text: `JOB_DETAILS:\n${JSON.stringify(jobInfo, null, 2)}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
      },
    });

    const text = response.response?.text();
    if (!text) {
      return resume;
    }

    const parsed = parseJson(text);
    if (!parsed) {
      return resume;
    }

    return {
      ...resume,
      summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim() : resume.summary,
      sections: Array.isArray(parsed.sections) && parsed.sections.length ? parsed.sections : resume.sections,
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : resume.skills,
    };
  } catch (error) {
    console.warn("Failed to tailor resume with AI", error);
    return resume;
  }
};
