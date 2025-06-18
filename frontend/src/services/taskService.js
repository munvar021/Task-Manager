import api from "./api";

const API_PREFIX = "/api/v1";

// Get all tasks with optional filtering and pagination
export const getAllTasks = async (params = {}) => {
  try {
    const response = await api.get(`${API_PREFIX}/tasks`, { params });
    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      data: [],
    };
  }
};

export const fetchTasks = async (limit, offset) => {
  const response = await fetch(
    `/tasks?limit=${limit}&offset=${offset}&sortBy=createdAt&sortOrder=DESC`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

// Get single task by ID
export const getTaskById = async (id) => {
  try {
    const response = await api.get(`${API_PREFIX}/tasks/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      data: null,
    };
  }
};

// Create new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post(`${API_PREFIX}/tasks`, taskData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Update existing task
export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`${API_PREFIX}/tasks/${id}`, taskData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`${API_PREFIX}/tasks/${id}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Get task statistics
export const getTaskStats = async () => {
  try {
    const response = await api.get(`${API_PREFIX}/tasks/stats`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      data: {
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        overdue: 0,
      },
    };
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
