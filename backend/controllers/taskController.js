const { AppDataSource } = require("../config/database");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

let taskRepository = null;

async function getRepository() {
  if (!taskRepository) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    taskRepository = AppDataSource.getRepository(Task);
  }
  return taskRepository;
}

// GET /tasks - Get all tasks with optional filtering and sorting
const getAllTasks = async (req, res, next) => {
  try {
    const repository = await getRepository();
    const {
      status,
      sortBy = "createdAt",
      sortOrder = "DESC",
      offset,
    } = req.query;

    const limit = 10; // fixed page size, no dropdown

    const queryOptions = {
      order: { [sortBy]: sortOrder.toUpperCase() },
      take: limit,
      skip: offset ? Number.parseInt(offset) : 0,
    };

    if (status && ["todo", "in_progress", "done"].includes(status)) {
      queryOptions.where = { status };
    }

    const tasks = await repository.find(queryOptions);
    const totalCount = await repository.count(
      queryOptions.where ? { where: queryOptions.where } : {}
    );

    res.status(200).json({
      success: true,
      data: tasks,
      meta: {
        total: totalCount,
        count: tasks.length,
        limit,
        offset: offset ? Number.parseInt(offset) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id - Get single task by ID
const getTaskById = async (req, res, next) => {
  try {
    const repository = await getRepository();
    const { id } = req.params;

    const task = await repository.findOne({ where: { id } });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// POST /tasks - Create new task
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
    }

    const repository = await getRepository();
    const { title, description, status = "todo", dueDate } = req.body;

    const newTask = repository.create({
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : null,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    const savedTask = await repository.save(newTask);

    res
      .status(201)
      .json({
        success: true,
        message: "Task created successfully",
        data: savedTask,
      });
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id - Update existing task
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
    }

    const repository = await getRepository();
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const existingTask = await repository.findOne({ where: { id } });

    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (title !== undefined) existingTask.title = title.trim();
    if (description !== undefined)
      existingTask.description = description ? description.trim() : null;
    if (status !== undefined) existingTask.status = status;
    if (dueDate !== undefined)
      existingTask.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await repository.save(existingTask);

    res
      .status(200)
      .json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id - Delete task
const deleteTask = async (req, res, next) => {
  try {
    const repository = await getRepository();
    const { id } = req.params;

    const existingTask = await repository.findOne({ where: { id } });

    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    await repository.delete({ id });

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /tasks/stats - Get task statistics
const getTaskStats = async (req, res, next) => {
  try {
    const repository = await getRepository();

    const [totalTasks, todoTasks, inProgressTasks, doneTasks, overdueTasks] =
      await Promise.all([
        repository.count(),
        repository.count({ where: { status: "todo" } }),
        repository.count({ where: { status: "in_progress" } }),
        repository.count({ where: { status: "done" } }),
        repository
          .createQueryBuilder("task")
          .where("task.dueDate < :now", { now: new Date() })
          .andWhere("task.status != :status", { status: "done" })
          .getCount(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
        overdue: overdueTasks,
        completed: doneTasks,
        pending: todoTasks + inProgressTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
