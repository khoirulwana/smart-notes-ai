const mongoose = require("mongoose");

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
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
