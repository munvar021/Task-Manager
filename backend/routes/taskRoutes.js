const express = require("express");
const {
  getTaskStats,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const {
  validateTask,
  validateTaskUpdate,
  validateUUID,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// GET /tasks/stats - Get task statistics (before /:id route)
router.get("/stats", getTaskStats);

// GET /tasks - Get all tasks with optional filtering
router.get("/", getAllTasks);

// GET /tasks/:id - Get single task by ID
router.get("/:id", validateUUID, getTaskById);

// POST /tasks - Create new task
router.post("/", validateTask, createTask);

// PUT /tasks/:id - Update existing task
router.put("/:id", validateUUID, validateTaskUpdate, updateTask);

// DELETE /tasks/:id - Delete task
router.delete("/:id", validateUUID, deleteTask);

module.exports = router;
