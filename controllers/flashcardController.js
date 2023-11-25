const Flashcard = require("../models/Flashcard");
const User = require('../models/User');

const addFlashcard = async (req, res) => {
  const { userId, question, answer } = req.body;

  try {
    // Step 1: Create the flashcard
    const newFlashcard = await Flashcard.create({ question, answer });

    // Step 2: Associate the flashcard with the user (if userId is provided)
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.flashcards.push(newFlashcard._id); // Assuming flashcards is an array of ObjectIds
        await user.save();
      } else {
        throw new Error("User not found");
      }
    }

    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error("Error in addFlashcard:", error.message); // Log the error message for debugging
    res.status(500).json({ message: "Error adding flashcard", error: error.message });
  }
};


const updateFlashcard = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
    const flashcard = await Flashcard.findByIdAndUpdate(id, { question, answer }, { new: true });
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Error updating flashcard" });
  }
};

const deleteFlashcard = async (req, res) => {
  const { id } = req.params;

  try {
    const flashcard = await Flashcard.findByIdAndDelete(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }
    res.json({ message: "Flashcard deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flashcard" });
  }
};

const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({});
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Error getting flashcards" });
  }
};

module.exports = {
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcards
};
