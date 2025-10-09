import PDFDocument from "pdfkit";
import type { ResumeData } from "./types";

const addSection = (doc: PDFDocument, heading: string) => {
  doc.moveDown(0.8);
  doc.fontSize(14).fillColor("#0ea5e9").text(heading.toUpperCase(), { continued: false });
  doc.moveDown(0.2);
  doc.fillColor("#0f172a");
};

export const resumeToPdf = (resume: ResumeData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc.font("Helvetica-Bold").fontSize(24).fillColor("#0f172a").text(resume.name, {
      align: "left",
    });

    if (resume.headline) {
      doc.moveDown(0.2);
      doc.font("Helvetica").fontSize(12).fillColor("#334155").text(resume.headline);
    }

    const contact: string[] = [];
    if (resume.email) contact.push(resume.email);
    if (resume.phone) contact.push(resume.phone);
    if (resume.location) contact.push(resume.location);

    if (contact.length) {
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor("#475569").text(contact.join("  |  "));
    }

    if (resume.links.length) {
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor("#0284c7").text(resume.links.map((link) => link.url).join("  |  "));
    }

    if (resume.summary) {
      addSection(doc, "Summary");
      doc.font("Helvetica").fontSize(11).fillColor("#0f172a").text(resume.summary);
    }

    if (resume.skills.length) {
      addSection(doc, "Skills");
      doc.fontSize(11).list(resume.skills, { bulletRadius: 2, textIndent: 12, bulletIndent: 6 });
    }

    resume.sections.forEach((section) => {
      if (!section.items.length) return;
      addSection(doc, section.heading);
      section.items.forEach((item) => {
        doc.font("Helvetica-Bold").fontSize(11).text(item.title, { continued: false });
        if (item.subtitle || item.date) {
          doc.font("Helvetica").fontSize(10).fillColor("#475569");
          const subtitleParts = [item.subtitle, item.date].filter(Boolean);
          if (subtitleParts.length) {
            doc.text(subtitleParts.join("  •  "));
          }
        }
        if (item.bullets?.length) {
          doc.moveDown(0.1);
          doc.font("Helvetica").fontSize(10).fillColor("#0f172a");
          doc.list(item.bullets, { bulletRadius: 2, textIndent: 12, bulletIndent: 6 });
        } else if (item.description) {
          doc.moveDown(0.1);
          doc.font("Helvetica").fontSize(10).fillColor("#0f172a").text(item.description);
        }
        doc.moveDown(0.6);
      });
    });

    doc.end();
  });
};
