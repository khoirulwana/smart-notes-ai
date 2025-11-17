/**
 * @fileoverview Server Express.js untuk Smart Notes AI API
 * @description Backend API dengan MongoDB, Google Gemini AI integration, dan CRUD operations
 * @module server
 * @requires express
 * @requires mongoose
 * @requires cors
 * @requires axios
 * @requires dotenv
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Validasi environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI tidak ditemukan di file .env");
  console.error("📝 Pastikan file .env ada di folder backend/ dengan format:");
  console.error("   MONGO_URI=mongodb://localhost:27017/smart-notes");
  console.error("   atau untuk MongoDB Atlas:");
  console.error(
    "   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-notes"
  );
  process.exit(1);
}

// Inisialisasi Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS untuk semua origin
app.use(express.json()); // Parse JSON request body

/**
 * Koneksi ke MongoDB
 * @description Menghubungkan aplikasi ke database MongoDB menggunakan URI dari environment variable
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (err.code === 8000 || err.codeName === "AtlasError") {
      console.error("🔐 Authentication Error - Kredensial MongoDB salah!");
      console.error("");
      console.error("💡 Solusi:");
      console.error("1. Periksa username dan password di MONGO_URI");
      console.error(
        "2. Pastikan karakter khusus di password sudah di-encode (misal: @ menjadi %40)"
      );
      console.error("3. Untuk MongoDB Atlas:");
      console.error("   - Pastikan IP address Anda sudah di-whitelist");
      console.error(
        "   - Pastikan user database memiliki permission yang tepat"
      );
      console.error(
        "   - Format: mongodb+srv://username:password@cluster.mongodb.net/database"
      );
      console.error("");
      console.error("📝 Contoh MONGO_URI yang benar:");
      console.error(
        "   MONGO_URI=mongodb+srv://myuser:mypass%40123@cluster0.xxxxx.mongodb.net/smart-notes"
      );
    } else if (
      err.message.includes("ENOTFOUND") ||
      err.message.includes("getaddrinfo")
    ) {
      console.error(
        "🌐 Network Error - Tidak dapat menghubungi MongoDB server"
      );
      console.error("");
      console.error("💡 Solusi:");
      console.error("1. Periksa koneksi internet Anda");
      console.error("2. Pastikan hostname/URL MongoDB benar");
      console.error("3. Untuk MongoDB Atlas, pastikan cluster masih aktif");
    } else {
      console.error("Error details:", err.message);
    }

    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("");
    console.error("🔧 Untuk menggunakan MongoDB lokal:");
    console.error(
      "   1. Install MongoDB: https://www.mongodb.com/try/download/community"
    );
    console.error("   2. Jalankan: mongod");
    console.error("   3. Set MONGO_URI=mongodb://localhost:27017/smart-notes");
    console.error("");
    process.exit(1);
  });

// Import Model
const Note = require("./models/Note");

/**
 * @route POST /api/summarize
 * @description Endpoint untuk menghasilkan ringkasan otomatis menggunakan Google Gemini AI
 * @access Public
 * @param {Object} req.body - Request body
 * @param {String} req.body.text - Teks yang akan diringkas
 * @returns {Object} 200 - Ringkasan dalam format JSON { summary: String }
 * @returns {Object} 500 - Error jika AI service tidak tersedia
 */
app.post("/api/summarize", async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Ringkas dalam 1 kalimat: ${req.body.text}` }],
          },
        ],
      }
    );
    const summary = response.data.candidates[0].content.parts[0].text.trim();
    res.json({ summary });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

/**
 * Fungsi untuk mengkategorikan teks secara otomatis
 * @description Mengklasifikasikan teks ke dalam kategori: "belajar", "kerja", atau "pribadi"
 * berdasarkan kata kunci yang ditemukan
 * @param {String} text - Teks yang akan dikategorikan
 * @returns {String} Kategori: "belajar", "kerja", atau "pribadi"
 */
const categorize = (text) => {
  const lower = text.toLowerCase();
  if (
    lower.includes("belajar") ||
    lower.includes("kursus") ||
    lower.includes("tutorial")
  )
    return "belajar";
  if (
    lower.includes("kerja") ||
    lower.includes("meeting") ||
    lower.includes("tugas")
  )
    return "kerja";
  return "pribadi";
};

/**
 * @route GET /api/notes
 * @description Mengambil semua catatan dari database, diurutkan berdasarkan tanggal dibuat (terbaru pertama)
 * @access Public
 * @returns {Array} 200 - Array of notes dalam format JSON
 */
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

/**
 * @route POST /api/notes
 * @description Membuat catatan baru dan menyimpannya ke database
 * @access Public
 * @param {Object} req.body - Request body
 * @param {String} req.body.title - Judul catatan (required)
 * @param {String} req.body.content - Isi catatan (required)
 * @param {String} [req.body.summary] - Ringkasan (optional, default: "Menunggu AI...")
 * @param {String} [req.body.category] - Kategori (optional, akan di-generate otomatis jika tidak ada)
 * @returns {Object} 200 - Note object yang baru dibuat
 */
app.post("/api/notes", async (req, res) => {
  const { title, content, summary, category } = req.body;
  const note = new Note({
    title,
    content,
    summary: summary || "Menunggu AI...",
    category: category || categorize(content),
  });
  await note.save();
  res.json(note);
});

// Server Configuration
const PORT = process.env.PORT || 5000;

/**
 * Menjalankan server Express
 * @description Server akan berjalan di port yang ditentukan oleh environment variable PORT atau default 5000
 */
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
