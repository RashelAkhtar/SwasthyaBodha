import {PDFParse} from "pdf-parse";
import Tesseract from "tesseract.js";

export const extractTextFromBuffer = async (file) => {
  if (file.mimetype === "application/pdf") {
    const data = await PDFParse(file.buffer);
    return data.text;
  }

  if (file.mimetype.startsWith("image/")) {
    const { data } = await Tesseract.recognize(file.buffer, "eng");
    return data.text;
  }

  throw new Error("Unsupported file type");
};