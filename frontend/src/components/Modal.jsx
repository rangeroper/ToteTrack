import React from "react";

export default function Modal({ children, onClose, showBackButton = false, onBack }) {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <button
          style={modalStyles.closeBtn}
          onClick={showBackButton ? onBack : onClose}
          aria-label={showBackButton ? "Back" : "Close"}
        >
          {showBackButton ? "←" : "×"}
        </button>
        {children}
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    minWidth: "300px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 15,
    fontSize: "1.5rem",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
};
