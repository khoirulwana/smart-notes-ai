const express = require("express");
const mongoose = require("mongoose");
const { Types } = mongoose;
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const Note = require("./models/Note");

const REQUIRED_ENV = ["MONGO_URI", "GEMINI_KEY"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDatabase();

const CATEGORY_KEYWORDS = [
  { label: "belajar", keywords: ["belajar", "kursus", "tutorial"] },
  { label: "kerja", keywords: ["kerja", "meeting", "tugas"] },
];

const categorize = (text = "") => {
  const lower = text.toLowerCase();
  const match = CATEGORY_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );
  return match?.label ?? "pribadi";
};

app.post("/api/summarize", async (req, res) => {
  const text = req.body?.text?.trim();
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Ringkas dalam 1 kalimat: ${text}` }],
          },
        ],
      }
    );
    const summary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!summary) {
      throw new Error("Tidak ada ringkasan dari AI");
    }
    res.json({ summary });
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    console.error("Summarize error:", message);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

app.get("/api/notes", async (_req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error.message);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  const title = req.body?.title?.trim();
  const content = req.body?.content?.trim();

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const note = await Note.create({
      title,
      content,
      summary: req.body?.summary?.trim() || "Menunggu AI...",
      category: req.body?.category || categorize(content),
    });
    res.status(201).json(note);
  } catch (error) {
    console.error("Failed to save note:", error.message);
    res.status(500).json({ error: "Failed to save note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete note:", error.message);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
