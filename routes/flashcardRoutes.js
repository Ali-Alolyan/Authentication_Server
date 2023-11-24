const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");

router.post("/add", flashcardController.addFlashcard);
router.put("/update/:id", flashcardController.updateFlashcard);
router.delete("/delete/:id", flashcardController.deleteFlashcard);
router.get("/", flashcardController.getFlashcards);

module.exports = router;
