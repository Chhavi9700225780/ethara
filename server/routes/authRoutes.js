const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

// add this route
router.get("/users", auth, authorize("Admin"), async (req, res) => {
  const users = await require("../models/User").find().select("name email");
  res.json(users);
});

module.exports = router;