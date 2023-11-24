const User = require("../models/User");
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

const updateFlashcardProgress = async (req, res) => {
  const { userId, flashcardId, difficulty } = req.body;
  
  try {
    // Fetch the user and flashcard data
    const user = await User.findById(userId);

    // Find the flashcard data for the specific flashcard
    const flashcardData = user.flashcards.find(f => f.flashcardId.toString() === flashcardId);
    if (!flashcardData) {
      return res.status(404).json({ message: "Flashcard not found for this user" });
    }

    // Calculate the new repetition count
    const updatedRepetitionCount = (flashcardData.repetitionCount || 0) + 1;

    // Logic to calculate nextReviewDate based on difficulty
    const nextReviewDate = calculateNextReviewDate(user, flashcardId, difficulty);

    // Update user's flashcard data
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        "flashcards.$[elem].nextReviewDate": nextReviewDate,
        "flashcards.$[elem].repetitionCount": updatedRepetitionCount
      }
    }, {
      arrayFilters: [{ "elem.flashcardId": flashcardId }],
      new: true
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating flashcard progress" });
  }
};


// Helper function to calculate next review date
function calculateNextReviewDate(user, flashcardId, difficulty) {
  const currentDate = new Date();
  const flashcardData = user.flashcards.find(f => f.flashcardId.toString() === flashcardId);
  
  let daysToAdd;

  switch(difficulty) {
    case 'easy':
      daysToAdd = 5 * (flashcardData.repetitionCount || 1); // Increase interval more for easy cards
      break;
    case 'medium':
      daysToAdd = 3 * (flashcardData.repetitionCount || 1); // Moderate increase for medium cards
      break;
    case 'hard':
      daysToAdd = 1; // Review hard cards more frequently
      break;
    default:
      daysToAdd = 2; // Default case if difficulty is not specified
  }

  return new Date(currentDate.setDate(currentDate.getDate() + daysToAdd));
}


module.exports = {
  getAllUsers,
  updateFlashcardProgress
};
