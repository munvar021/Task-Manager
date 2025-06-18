import "./filterBarStyles.css";
import { useState, useEffect } from "react";

export default function FilterBar({
  currentFilter,
  onFilterChange,
  taskCounts,
}) {
  const filters = [
    {
      key: "all",
      label: "All Tasks",
      icon: "fas fa-list",
      count: taskCounts.all,
    },
    {
      key: "todo",
      label: "To Do",
      icon: "fas fa-circle",
      count: taskCounts.todo,
    },
    {
      key: "in_progress",
      label: "In Progress",
      icon: "fas fa-clock",
      count: taskCounts.in_progress,
    },
    {
      key: "done",
      label: "Completed",
      icon: "fas fa-check-circle",
      count: taskCounts.done,
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div className="filter-bar">
      {!isMobile ? (
        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${
                currentFilter === filter.key ? "active" : ""
              }`}
              onClick={() => onFilterChange(filter.key)}
            >
              <i className={filter.icon}></i>
              <span className="filter-label">{filter.label}</span>
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="filter-dropdown-wrapper">
          <select
            className="filter-dropdown"
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {filters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.label} ({filter.count})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
