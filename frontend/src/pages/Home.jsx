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
        {/* Remove Manage Tags here, will be in Settings */}
      </nav>
    </div>
  );
}
