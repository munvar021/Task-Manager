"use client";

import { useState, useEffect } from "react";
import { healthCheck } from "../../../services";
import "./connectionStatusStyles.css";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);

    try {
      const result = await healthCheck();
      setIsConnected(result.success);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isConnected === null) return null;

  return (
    <div
      className={`connection-status ${
        isConnected ? "connected" : "disconnected"
      }`}
    >
      <div className="connection-indicator">
        {isChecking ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i
            className={`fas ${
              isConnected ? "fa-wifi" : "fa-exclamation-triangle"
            }`}
          ></i>
        )}
        <span>
          {isConnected ? "Connected to server" : "Server connection lost"}
        </span>
        {!isConnected && (
          <button
            onClick={checkConnection}
            className="retry-btn"
            disabled={isChecking}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
