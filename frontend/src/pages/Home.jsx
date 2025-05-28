import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "0rem 2rem" }}>
      <h1>Welcome to Tote Management</h1>
      <p>Your one-stop dashboard for managing storage totes.</p>
      <nav style={{ marginTop: "1.5rem" }}>
        <Link
          to="/totes"
          style={{ marginRight: "1rem", textDecoration: "none", color: "#007bff" }}
        >
          View All Totes
        </Link>
        <Link
          to="/create"
          style={{ marginRight: "1rem", textDecoration: "none", color: "#28a745" }}
        >
          Add New Tote
        </Link>
        {/* New button to manage tags */}
        <Link
          to="/tags"
          style={{
            textDecoration: "none",
            color: "rgb(0, 123, 255)",
            fontWeight: "bold",
            border: "1px solid rgb(0, 123, 255)",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            marginLeft: "1rem",
            display: "inline-block",
          }}
        >
          Manage Tags
        </Link>
      </nav>
    </div>
  );
}
