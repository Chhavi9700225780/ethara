const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// ✅ GET ALL USERS (Admin only)
router.get("/", auth, authorize("Admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


// ✅ CREATE USER (Admin only)
router.post("/", auth, authorize("Admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check existing
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Member",
    });

    res.status(201).json(user);

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


// ✅ DELETE USER (Admin only)
router.delete("/:id", auth, authorize("Admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;