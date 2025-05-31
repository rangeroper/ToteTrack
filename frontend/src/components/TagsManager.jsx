import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function TagsManager() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/tags/`);
      setTags(res.data.tags);
      setError("");
    } catch (e) {
      setError("Failed to load tags");
    } finally {
      setLoading(false);
    }
  }

  async function createTag() {
    if (!newTagName.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/tags/`, { name: newTagName.trim() });
      setNewTagName("");
      fetchTags();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error creating tag");
    }
  }

  function startEdit(tag) {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
    setError("");
  }

  function cancelEdit() {
    setEditingTagId(null);
    setEditingTagName("");
    setError("");
  }

  async function saveEdit() {
    if (!editingTagName.trim()) return;

    try {
      // Fetch count of affected totes for current tag
      const res = await axios.get(`${API_BASE_URL}/tags/${editingTagId}/affected-count`);
      const count = res.data.affected_count;

      // Confirm rename with count
      if (!window.confirm(`Renaming this tag will update ${count} tote${count !== 1 ? 's' : ''}. Proceed?`)) {
        return;
      }

      await axios.patch(`${API_BASE_URL}/tags/${editingTagId}`, { name: editingTagName.trim() });
      setEditingTagId(null);
      setEditingTagName("");
      fetchTags();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error renaming tag");
    }
  }

  async function deleteTag(id) {
    try {
      const res = await axios.get(`${API_BASE_URL}/tags/${id}/affected-count`);
      const count = res.data.affected_count;

      if (!window.confirm(`Deleting this tag will remove it from ${count} tote${count !== 1 ? 's' : ''}. Proceed?`)) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/tags/${id}`);
      fetchTags();
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Error deleting tag");
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
      <h2 style={{ fontSize: 24, marginBottom: 20, color: "#333" }}>Tag Management</h2>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTag()}
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
          onClick={createTag}
          disabled={loading || !newTagName.trim()}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading || !newTagName.trim() ? "not-allowed" : "pointer",
            opacity: loading || !newTagName.trim() ? 0.6 : 1
          }}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#555" }}>Loading tags...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tags.map((tag) => (
            <li
              key={tag.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                color: "#333",
              }}
            >
              {editingTagId === tag.id ? (
                <>
                  <input
                    type="text"
                    value={editingTagName}
                    onChange={(e) => setEditingTagName(e.target.value)}
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
                  <span>{tag.name}</span>
                  <div>
                    <button
                      onClick={() => startEdit(tag)}
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
                      onClick={() => deleteTag(tag.id)}
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
