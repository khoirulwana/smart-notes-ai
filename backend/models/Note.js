/**
 * @fileoverview Model Note untuk MongoDB
 * @description Schema dan model untuk menyimpan catatan dengan AI summary dan kategori
 * @module models/Note
 */

const mongoose = require("mongoose");

/**
 * Schema untuk Note
 * @typedef {Object} NoteSchema
 * @property {String} title - Judul catatan (required)
 * @property {String} content - Isi/konten catatan (required)
 * @property {String} summary - Ringkasan otomatis dari AI (default: "Menunggu AI...")
 * @property {String} category - Kategori catatan: "belajar", "kerja", atau "pribadi" (default: "pribadi")
 * @property {Date} createdAt - Timestamp saat catatan dibuat (auto-generated)
 * @property {Date} updatedAt - Timestamp saat catatan terakhir diupdate (auto-generated)
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "Menunggu AI...",
    },
    category: {
      type: String,
      enum: ["belajar", "kerja", "pribadi"],
      default: "pribadi",
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

/**
 * Model Note untuk MongoDB
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("Note", noteSchema);
