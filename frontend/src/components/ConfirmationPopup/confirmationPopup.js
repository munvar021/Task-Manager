"use client";

import { useEffect } from "react";
import "./confirmationPopupStyles.css";

export default function ConfirmationPopup({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">
            <i
              className={`fas ${
                type === "danger"
                  ? "fa-exclamation-triangle"
                  : "fa-question-circle"
              }`}
            ></i>
            {title}
          </h3>
          <button className="popup-close" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="popup-body">
          <p className="popup-message">{message}</p>
        </div>

        <div className="popup-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${
              type === "danger" ? "btn-danger" : "btn-primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
