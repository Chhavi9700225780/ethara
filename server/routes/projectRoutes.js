const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { createProject, getProjects,  deleteProject  } = require("../controllers/projectController");

// ✅ Only Admin can create project
router.post("/", auth, authorize("Admin"), createProject);

// ✅ Both Admin & Member can view projects
router.get("/", auth, authorize("Admin", "Member"), getProjects);

router.delete("/:id", auth, authorize("Admin"), deleteProject);

module.exports = router;