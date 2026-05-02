const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createTask,
  updateTask,
  getTasks,
   deleteTask
} = require("../controllers/taskController");

// ✅ Only Admin can create/assign task
router.post("/", auth, authorize("Admin"), createTask);

// ✅ Both Admin & Member can update task status
router.put("/:id", auth, authorize("Admin", "Member"), updateTask);

// ✅ Both can view tasks
router.get("/", auth, authorize("Admin", "Member"), getTasks);

router.delete("/:id", auth, authorize("Admin"), deleteTask);

module.exports = router;