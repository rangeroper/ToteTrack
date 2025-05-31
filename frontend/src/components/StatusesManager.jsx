import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function StatusesManager() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusName, setEditingStatusName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  async function fetchStatuses() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/statuses/`);
      setStatuses(res.data.statuses);
      setError("");
    } catch (e) {
      setError("Failed to load statuses");
    } finally {
      setLoading(false);
    }
  }

  async function createStatus() {
    if (!newStatusName.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/statuses/`, { name: newStatusName.trim() });
      setNewStatusName("");
      fetchStatuses();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error creating status");
    }
  }

  function startEdit(status) {
    setEditingStatusId(status.id);
    setEditingStatusName(status.name);
    setError("");
  }

  function cancelEdit() {
    setEditingStatusId(null);
    setEditingStatusName("");
    setError("");
  }

  async function saveEdit() {
    if (!editingStatusName.trim()) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/statuses/${editingStatusId}/affected-count`);
      const count = res.data.affected_count;

      if (!window.confirm(`Renaming this status will update ${count} item${count !== 1 ? "s" : ""}. Proceed?`)) {
        return;
      }

      await axios.patch(`${API_BASE_URL}/statuses/${editingStatusId}`, { name: editingStatusName.trim() });
      setEditingStatusId(null);
      setEditingStatusName("");
      fetchStatuses();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error renaming status");
    }
  }

  async function deleteStatus(id) {
    try {
      const res = await axios.get(`${API_BASE_URL}/statuses/${id}/affected-count`);
      const count = res.data.affected_count;

      if (!window.confirm(`Deleting this status will remove it from ${count} item${count !== 1 ? "s" : ""}. Proceed?`)) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/statuses/${id}`);
      fetchStatuses();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error deleting status");
    }
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      padding: 24,
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      borderRadius: 8,
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, color: "#333" }}>Status Management</h2>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New status name"
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createStatus()}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: 14
          }}
        />
        <button
          onClick={createStatus}
          disabled={loading || !newStatusName.trim()}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading || !newStatusName.trim() ? "not-allowed" : "pointer",
            opacity: loading || !newStatusName.trim() ? 0.6 : 1
          }}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#555" }}>Loading statuses...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {statuses.map((status) => (
            <li
              key={status.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                color: "#333",
              }}
            >
              {editingStatusId === status.id ? (
                <>
                  <input
                    type="text"
                    value={editingStatusName}
                    onChange={(e) => setEditingStatusName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      marginRight: 8
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    style={{
                      marginRight: 4,
                      background: "none",
                      border: "none",
                      color: "green",
                      cursor: "pointer"
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#555",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{status.name}</span>
                  <div>
                    <button
                      onClick={() => startEdit(status)}
                      style={{
                        marginRight: 8,
                        background: "none",
                        border: "none",
                        color: "#007BFF",
                        cursor: "pointer"
                      }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => deleteStatus(status.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
