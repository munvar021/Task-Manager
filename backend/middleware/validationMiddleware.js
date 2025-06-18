const { body, param } = require("express-validator");

// UUID validation
const validateUUID = [
  param("id").isUUID().withMessage("Invalid task ID format"),
];

// Task creation validation
const validateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "done"])
    .withMessage("Status must be one of: todo, in_progress, done"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date")
    .custom((value) => {
      if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    }),
];

// Task update validation (all fields optional)
const validateTaskUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "done"])
    .withMessage("Status must be one of: todo, in_progress, done"),

  body("dueDate")
    .optional()
    .custom((value) => {
      if (value === null || value === "") {
        return true; // Allow null/empty to clear due date
      }
      if (!Date.parse(value)) {
        throw new Error("Due date must be a valid date");
      }
      return true;
    }),
];

module.exports = {
  validateUUID,
  validateTask,
  validateTaskUpdate,
};
