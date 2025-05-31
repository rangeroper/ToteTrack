import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function LocationsManager() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editingLocationName, setEditingLocationName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/locations/`);
      setLocations(res.data.locations);
      setError("");
    } catch (e) {
      setError("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }

  async function createLocation() {
    if (!newLocationName.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/locations/`, { name: newLocationName.trim() });
      setNewLocationName("");
      fetchLocations();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error creating location");
    }
  }

  function startEdit(location) {
    setEditingLocationId(location.id);
    setEditingLocationName(location.name);
    setError("");
  }

  function cancelEdit() {
    setEditingLocationId(null);
    setEditingLocationName("");
    setError("");
  }

  async function saveEdit() {
    if (!editingLocationName.trim()) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/locations/${editingLocationId}/affected-count`);
      const count = res.data.affected_count;

      if (!window.confirm(`Renaming this location will update ${count} item${count !== 1 ? "s" : ""}. Proceed?`)) {
        return;
      }

      await axios.patch(`${API_BASE_URL}/locations/${editingLocationId}`, { name: editingLocationName.trim() });
      setEditingLocationId(null);
      setEditingLocationName("");
      fetchLocations();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error renaming location");
    }
  }

  async function deleteLocation(id) {
    try {
      const res = await axios.get(`${API_BASE_URL}/locations/${id}/affected-count`);
      const count = res.data.affected_count;

      if (!window.confirm(`Deleting this location will remove it from ${count} item${count !== 1 ? "s" : ""}. Proceed?`)) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/locations/${id}`);
      fetchLocations();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error deleting location");
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
      <h2 style={{ fontSize: 24, marginBottom: 20, color: "#333" }}>Location Management</h2>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New location name"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createLocation()}
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
          onClick={createLocation}
          disabled={loading || !newLocationName.trim()}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading || !newLocationName.trim() ? "not-allowed" : "pointer",
            opacity: loading || !newLocationName.trim() ? 0.6 : 1
          }}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#555" }}>Loading locations...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {locations.map((location) => (
            <li
              key={location.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                color: "#333",
              }}
            >
              {editingLocationId === location.id ? (
                <>
                  <input
                    type="text"
                    value={editingLocationName}
                    onChange={(e) => setEditingLocationName(e.target.value)}
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
                  <span>{location.name}</span>
                  <div>
                    <button
                      onClick={() => startEdit(location)}
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
                      onClick={() => deleteLocation(location.id)}
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
