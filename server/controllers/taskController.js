const Task = require("../models/Task");

// ✅ CREATE TASK (Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    if (!title || !project || !assignedTo) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo, // can be array now
      dueDate,
      status: "Pending",
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name")
      .populate("project", "title");

    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ UPDATE TASK (STATUS + EDIT SUPPORT)
exports.updateTask = async (req, res) => {
  const { status, title, description, assignedTo, project } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔥 STATUS SAFE MAPPING
    if (status) {
      const map = {
        "pending": "Pending",
        "in progress": "In Progress",
        "completed": "Completed",
      };

      task.status = map[status.toLowerCase()] || status;
    }

    // ✏️ EDIT SUPPORT
    if (title) task.title = title;
    if (description) task.description = description;
    if (project) task.project = project;

    // ✅ MULTI USER SUPPORT
    if (assignedTo) {
      task.assignedTo = Array.isArray(assignedTo)
        ? assignedTo
        : [assignedTo];
    }

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name")
      .populate("project", "title");

    res.json(populatedTask);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};