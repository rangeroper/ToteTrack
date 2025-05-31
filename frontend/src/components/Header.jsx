import React, { useState } from "react";
import { Link } from "react-router-dom";
import Settings from "./Settings"; // Adjust path

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        backgroundColor: "#282c34",
        color: "white",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
          display: "flex",
          alignItems: "center",
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginRight: "0.5rem",
          }}
          aria-label="Truck icon"
          role="img"
        >
          📦
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "1.25rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "70vw",
          }}
        >
          Inventory Management Suite
        </h1>
      </Link>

      <nav
        style={{
          marginLeft: "auto",
          marginTop: "0.5rem",
          flexBasis: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setShowSettings(true)}
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderRadius: "4px",
            color: "white",
            padding: "0.3rem 0.8rem",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          aria-label="Open Settings"
        >
          Settings ⚙️
        </button>
      </nav>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </header>
  );
}
