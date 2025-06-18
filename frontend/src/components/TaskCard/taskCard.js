"use client";

import Link from "next/link";
import "./taskCardStyles.css";

export default function TaskCard({ task, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return "fas fa-circle";
      case "in_progress":
        return "fas fa-clock";
      case "done":
        return "fas fa-check-circle";
      default:
        return "fas fa-circle";
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== "done";
  };

  return (
    <div className={`task-card ${isOverdue(task.dueDate) ? "overdue" : ""}`}>
      <div className="task-card-header">
        <div className="task-status">
          <i className={getStatusIcon(task.status)}></i>
          <span className={`status-badge status-${task.status}`}>
            {task.status.replace("_", " ")}
          </span>
        </div>
        <div className="task-actions">
          <Link
            href={`/edit-task/${task.id}`}
            className="action-btn edit-btn"
            title="Edit Task"
          >
            <i className="fas fa-edit"></i>
          </Link>
          <button
            onClick={() => onDelete(task.id, task.title)}
            className="action-btn delete-btn"
            title="Delete Task"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-card-footer">
        <div className="task-dates">
          {task.dueDate && (
            <div
              className={`due-date ${
                isOverdue(task.dueDate) ? "overdue-text" : ""
              }`}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
          <div className="created-date">
            <i className="fas fa-clock"></i>
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
