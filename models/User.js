const mongoose = require("mongoose");

const flashcardDataSchema = new mongoose.Schema({
  flashcardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  },
  repetitionCount: Number,
  nextReviewDate: Date
});

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  flashcards: [flashcardDataSchema]
});

module.exports = mongoose.model("User", userSchema);
