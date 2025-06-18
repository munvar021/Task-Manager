"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TaskCard from "../../components/TaskCard/taskCard";
import ConfirmationPopup from "../../components/ConfirmationPopup/confirmationPopup";
import FilterBar from "../../components/FilterBar/filterBar";
import Pagination from "../../components/Pagination/pagination";
import Toast from "../../components/Toast/toast";
import {
  getAllTasks,
  deleteTask,
  getTaskStats,
} from "../../services/taskService";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import "./homeStyles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    taskId: null,
    taskTitle: "",
  });
  const [taskStats, setTaskStats] = useState({
    all: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
  });

  const { loading, error, execute, clearError } = useApi();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Fetch tasks from API with backend filtering and pagination
  const fetchTasks = useCallback(async () => {
    const params = {
      sortBy: "createdAt",
      sortOrder: "DESC",
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };

    // Add status filter if not "all"
    if (filter !== "all") {
      params.status = filter;
    }

    const result = await execute(getAllTasks, params);

    if (result.success) {
      setTasks(result.data);
      setTotalItems(result.meta.total);
      setTotalPages(Math.ceil(result.meta.total / itemsPerPage));
    } else {
      showError("Failed to load tasks");
    }
  }, [execute, filter, currentPage, itemsPerPage, showError]);

  const fetchTaskStats = useCallback(async () => {
    const result = await execute(getTaskStats);

    if (result.success) {
      setTaskStats({
        all: result.data.total,
        todo: result.data.todo,
        in_progress: result.data.inProgress,
        done: result.data.done,
      });
    }
  }, [execute]);

  // Fetch tasks and stats on component mount and when dependencies change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleDeleteClick = (taskId, taskTitle) => {
    setDeletePopup({ show: true, taskId, taskTitle });
  };

  const handleDeleteConfirm = async () => {
    const result = await execute(deleteTask, deletePopup.taskId);

    if (result.success) {
      showSuccess("Task deleted successfully");
      setDeletePopup({ show: false, taskId: null, taskTitle: "" });

      // Refresh tasks and stats
      fetchTasks();
      fetchTaskStats();
    } else {
      showError("Failed to delete task");
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopup({ show: false, taskId: null, taskTitle: "" });
  };

  const handleRetry = () => {
    clearError();
    fetchTasks();
    fetchTaskStats();
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-tasks"></i>
            Task Manager
          </h1>
          <Link href="/add-task" className="btn btn-primary add-task-btn">
            <i className="fas fa-plus"></i>
            Add New Task
          </Link>
        </div>
      </header>

      <main className="home-main">
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h4>Connection Error</h4>
                <p>{error}</p>
              </div>
              <button onClick={handleRetry} className="btn btn-secondary">
                <i className="fas fa-redo"></i>
                Retry
              </button>
            </div>
          </div>
        )}

        <FilterBar
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          taskCounts={taskStats}
        />

        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-clipboard-list"></i>
              <h3>No tasks found</h3>
              <p>
                {filter === "all"
                  ? "You haven't created any tasks yet. Click 'Add New Task' to get started!"
                  : `No tasks with status "${filter.replace("_", " ")}" found.`}
              </p>
              {filter === "all" && (
                <Link href="/add-task" className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Create Your First Task
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </div>
      </main>

      <ConfirmationPopup
        show={deletePopup.show}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletePopup.taskTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </div>
  );
}
