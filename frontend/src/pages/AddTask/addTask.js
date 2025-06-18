"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../../components/Toast/toast";
import { createTask } from "../../services/taskService";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import "./addTaskStyles.css";

export default function AddTask() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  const { loading, error, execute, clearError } = useApi();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 1) {
      newErrors.title = "Task title must be at least 1 character long";
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Task title must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status,
      dueDate: formData.dueDate || null,
    };

    const result = await execute(createTask, taskData);

    if (result.success) {
      showSuccess("Task created successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      showError(result.error || "Failed to create task");

      // Handle validation errors from backend
      if (result.errors && result.errors.length > 0) {
        const backendErrors = {};
        result.errors.forEach((err) => {
          if (err.path) {
            backendErrors[err.path] = err.msg;
          }
        });
        setErrors(backendErrors);
      }
    }
  };

  return (
    <div className="add-task-container">
      <div className="add-task-header">
        <Link href="/" className="back-btn">
          <i className="fas fa-arrow-left"></i>
          Back to Tasks
        </Link>
        <h1 className="page-title">
          <i className="fas fa-plus-circle"></i>
          Add New Task
        </h1>
      </div>

      <div className="add-task-content">
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h4>Error Creating Task</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? "error" : ""}`}
              placeholder="Enter task title..."
              maxLength="255"
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description ? "error" : ""}`}
              placeholder="Enter task description..."
              rows="4"
              maxLength="1000"
            />
            <div className="character-count">
              {formData.description.length}/1000 characters
            </div>
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`form-input ${errors.dueDate ? "error" : ""}`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.dueDate && (
                <span className="error-message">{errors.dueDate}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link href="/" className="btn btn-secondary">
              <i className="fas fa-times"></i>
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </div>
  );
}
