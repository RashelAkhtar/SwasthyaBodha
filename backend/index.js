import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { analyzeReport } from "./geminiService.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 5 * 1024 * 1024,
  }, // 5MB limit
});

app.get("/health", (req, res) => {
  res.json({ status: "AI Service Running" });
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text || "";
    const image = req.file || null;

    if (!text && !image) {
      return res.status(400).json({ error: "Provide at least image or text" });
    }

    const result = await analyzeReport({ text, image });

    res.json({
      id: uuidv4(),
      ...result,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});
