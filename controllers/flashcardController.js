const Flashcard = require("../models/Flashcard");

const addFlashcard = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const newFlashcard = await Flashcard.create({ question, answer });
    res.status(201).json(newFlashcard);
  } catch (error) {
    res.status(500).json({ message: "Error adding flashcard" });
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
