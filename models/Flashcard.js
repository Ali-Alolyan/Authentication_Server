const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  nextReviewDate: {
    type: Date,
    default: Date.now // Sets initial review date to the current date
  },
  difficulty: {
    type: String,
    default: "medium" // Default difficulty can be medium
  },
  repetitionCount: {
    type: Number,
    default: 0 // Initialize repetition count
  }
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
