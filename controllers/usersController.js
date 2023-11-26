const User = require("../models/User");
const Flashcard = require("../models/Flashcard");
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

const updateFlashcardProgress = async (req, res) => {
  const { flashcardId, difficulty } = req.body;
  // Ensure difficulty is a valid value (e.g., 'easy', 'medium', 'hard')
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty value" });
  }
  
  try {
    // Fetch the flashcard
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    // Calculate the new repetition count and next review date
    flashcard.repetitionCount += 1;
    flashcard.difficulty = difficulty;
    flashcard.nextReviewDate = calculateNextReviewDate(flashcard, difficulty);

    // Save the updated flashcard
    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Error updating flashcard progress" });
  }
};


// Helper function to calculate next review date
function calculateNextReviewDate(flashcard, difficulty) {
  const currentDate = new Date();
  let daysToAdd;

  switch(difficulty) {
    case 'easy':
      daysToAdd = 5 * (flashcard.repetitionCount || 1);
      break;
    case 'medium':
      daysToAdd = 3 * (flashcard.repetitionCount || 1);
      break;
    case 'hard':
      daysToAdd = 1;
      break;
    default:
      daysToAdd = 2;
  }

  return new Date(currentDate.setDate(currentDate.getDate() + daysToAdd));
}


module.exports = {
  getAllUsers,
  updateFlashcardProgress
};
