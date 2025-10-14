const decodeText = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};

export const extractTextFromPdf = async (buffer: Buffer | ArrayBuffer): Promise<string> => {
  const input = buffer instanceof Buffer ? buffer : Buffer.from(buffer as ArrayBuffer);
  const { default: PDFParser } = await import("pdf2json");

  return new Promise((resolve, reject) => {
    const parser = new PDFParser(undefined, 1);

    parser.on("pdfParser_dataError", (err) => {
      reject(new Error(err.parserError || "Failed to parse PDF"));
    });

    parser.on("pdfParser_dataReady", (pdfData) => {
      if (!pdfData?.formImage?.Pages) {
        resolve("");
        return;
      }
      const lines = pdfData.formImage.Pages.flatMap((page: any) => {
        return page.Texts.map((text: any) =>
          decodeText(
            text.R?.map((entry: any) => decodeText(entry.T || "")).join(" ") || ""
          )
        );
      });
      resolve(lines.join("\n"));
    });

    parser.parseBuffer(input);
  });
};
