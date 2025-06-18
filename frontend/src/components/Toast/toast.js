"use client";

import { useEffect } from "react";
import "./toastStyles.css";

export default function Toast({
  message,
  type = "success",
  show,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle";
      case "error":
        return "fas fa-exclamation-circle";
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
        return "fas fa-info-circle";
      default:
        return "fas fa-check-circle";
    }
  };

  return (
    <div className={`toast toast-${type} ${show ? "toast-show" : ""}`}>
      <div className="toast-content">
        <i className={getIcon()}></i>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
