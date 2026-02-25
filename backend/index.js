import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { analyzeReport } from "./services/geminiService.js";
import { interpretForPatient } from "./services/patientService.js";
import { extractTextFromBuffer } from "./services/textExtraction.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  }, // 5MB limit
});

app.get("/health", (req, res) => {
  res.json({ status: "AI Service Running" });
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text || "";
    const language = req.body.language || "English";
    const image = req.file || null;

    if (!text && !image) {
      return res.status(400).json({ error: "Provide at least image or text" });
    }

    const result = await analyzeReport({ text, image, language });

    res.json({
      id: uuidv4(),
      ...result,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.post("/interpret", upload.single("file"), async (req, res) => {
  try {
    let extractedText = "";

    if (req.file) {
      extractedText = await extractTextFromBuffer(req.file);
    } else if (req.body.text) {
      extractedText = req.body.text;
    } else {
      return res.status(400).json({ error: "Provide text or file." });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "No readable text found." });
    }

    const result = await interpretForPatient({
      text: extractedText,
      language: req.body.language || "English",
    });

    res.json({
      id: uuidv4(),
      ...result,
    });
  } catch (err) {
    console.error("Interpretation ERROR:", err.message);
    res.status(500).json({ error: "Interpretation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});
