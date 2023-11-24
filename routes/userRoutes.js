const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(usersController.getAllUsers);

// Add the route for updating flashcard progress
router.route("/updateFlashcardProgress").post(usersController.updateFlashcardProgress);

module.exports = router;
