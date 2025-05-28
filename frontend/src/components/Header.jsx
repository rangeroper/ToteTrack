import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        flexWrap: "wrap", // allow wrapping on small screens
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
            maxWidth: "70vw", // prevent overflow
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
        }}
      >
        {/* Future nav links here */}
      </nav>
    </header>
  );
}
