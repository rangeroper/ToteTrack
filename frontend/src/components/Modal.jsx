import React, { useEffect } from "react";

export default function Modal({ children, onClose, showBackButton = false, onBack, modalStyle = {} }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Lock scroll
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = ""; // Unlock on modal close/unmount
      document.documentElement.style.overflow = "";
    };
  }, []);

  const dynamicModalStyle = {
    ...modalStyles.modal,
    ...modalStyle,
    padding: showBackButton ? 20 : modalStyle.padding ?? 0,
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={dynamicModalStyle}>
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
    borderRadius: 12,
    minWidth: "300px",
    maxWidth: "90vw",
    maxHeight: "65vh",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",      // Allow vertical scrolling inside the modal
    overflowX: "hidden",    // Prevent horizontal scrolling inside the modal
    position: "relative",
    transform: "translateZ(0)",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
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
