const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");

router.post("/add", flashcardController.addFlashcard);
router.put("/update/:id", flashcardController.updateFlashcard);
router.put("/updateFlashcardProgress/:id", flashcardController.updateFlashcardProgress);
router.delete("/delete/:id", flashcardController.deleteFlashcard);
router.get("/user/:userId", flashcardController.getFlashcardsByUser);
router.get("/review/:userId", flashcardController.getFlashcardsToReview);
router.get("/", flashcardController.getFlashcards);

module.exports = router;
