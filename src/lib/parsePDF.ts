import * as _pdfParse from "pdf-parse";

// 2. We extract the actual function, whether it's bundled as a default or not
const pdfParse = (_pdfParse as any).default || _pdfParse;

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}