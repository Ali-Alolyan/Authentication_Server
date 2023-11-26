const Flashcard = require("../models/Flashcard");
const User = require('../models/User');

const addFlashcard = async (req, res) => {
  const { userId, question, answer } = req.body;

  try {
    // Step 1: Create the flashcard with initial spaced repetition data
    const newFlashcard = await Flashcard.create({ question, answer });

    // Step 2: Associate the flashcard ID with the user (if userId is provided)
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.flashcards.push(newFlashcard._id); // Just store the ID
        await user.save();
      } else {
        throw new Error("User not found");
      }
    }

    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error("Error in addFlashcard:", error.message);
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
     res.json(flashcard);
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

const getFlashcardsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retrieve the array of flashcard IDs from the user's document
        const flashcardIds = user.flashcards; // Assuming 'flashcards' is an array of ObjectIds

        // Fetch the corresponding flashcards from the Flashcard collection
        const flashcards = await Flashcard.find({ '_id': { $in: flashcardIds } });

        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Error getting flashcards' });
    }
};

const getFlashcardsToReview = async (req, res) => {
  const userId = req.params.userId;
  const currentDate = new Date();

  try {
    // Fetch user's flashcards IDs
    const user = await User.findById(userId).select('flashcards');
    const flashcardsToReview = await Flashcard.find({
      '_id': { $in: user.flashcards },
      'nextReviewDate': { $lte: currentDate }
    });

    res.json(flashcardsToReview);
  } catch (error) {
    res.status(500).json({ message: 'Error getting flashcards to review' });
  }
};


module.exports = {
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcards,
  getFlashcardsByUser,
  getFlashcardsToReview
};
