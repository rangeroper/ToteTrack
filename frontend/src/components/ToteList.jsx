import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterSortBar from "./FilterSortBar";
import "../components/ToteList.css";

export default function ToteList() {
  const [totes, setTotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTotes, setFilteredTotes] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [sortConfig, setSortConfig] = useState({ key: "barcode", direction: "asc" });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/totes`);
        if (!response.ok) throw new Error("Failed to fetch totes");
        const { totes: fetchedTotes } = await response.json();
        setTotes(fetchedTotes);
        setFilteredTotes(sortTotes(fetchedTotes, sortConfig));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTotes();
  }, []);

  const sortTotes = (totes, { key, direction }) => {
    return [...totes].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      const aStr = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const bStr = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key, directionOverride) => {
    let direction = directionOverride || "asc";
    if (!directionOverride && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    setFilteredTotes(sortTotes(filteredTotes, newSortConfig));
  };

  const sortableColumns = {
    barcode: "Barcode",
    location: "Location",
    weight: "Weight",
    tags: "Tags",
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleDelete = async (idToDelete, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete tote with ID ${idToDelete}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/totes/${idToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tote");
      const updatedTotes = totes.filter((t) => t.id !== idToDelete);
      setTotes(updatedTotes);
      setFilteredTotes(sortTotes(updatedTotes, sortConfig));
    } catch (err) {
      alert("Error deleting tote: " + err.message);
    }
  };

  const toggleDescription = (id, e) => {
    e.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p>Loading totes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="tote-list-container">
      <div className="tote-list-header">
        <FilterSortBar totes={totes} onFilteredChange={(newFiltered) => {
          setFilteredTotes(sortTotes(newFiltered, sortConfig));
        }} />

        <div className="mobile-sort">
          <label htmlFor="mobile-sort-select" className="mobile-sort-label">Sort by:</label>
          <select
            id="mobile-sort-select"
            className="mobile-sort-select"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              handleSort(key, direction);
            }}
          >
            {Object.entries(sortableColumns).map(([key, label]) => (
              <>
                <option key={`${key}-asc`} value={`${key}-asc`}>
                  {label} (A-Z)
                </option>
                <option key={`${key}-desc`} value={`${key}-desc`}>
                  {label} (Z-A)
                </option>
              </>
            ))}
          </select>
        </div>

      </div>

      <table className="tote-table" aria-label="Tote List Table">
        <thead>
          <tr>
            {[
              "barcode",
              "description",
              "status",
              "location",
              "weight",
              "tags",
              "images",
              "qr",
              "actions"
            ].map((key) => (
              <th
                key={key}
                scope="col"
                onClick={() => sortableColumns[key] && handleSort(key)}
                style={{ cursor: sortableColumns[key] ? "pointer" : "default" }}
              >
                {sortableColumns[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                {" "}
                {renderSortIcon(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTotes.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "1rem" }}>
                No totes available.
              </td>
            </tr>
          ) : (
            filteredTotes.map((tote) => (
              <tr
                key={tote.id}
                tabIndex={0}
                onClick={() => navigate(`/totes/${tote.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{tote.barcode}</td>
                <td>
                  {tote.description.length <= 60 || expandedDescriptions[tote.id] ? (
                    <>
                      {tote.description}
                      {tote.description.length > 60 && (
                        <button className="show-more-less-btn" onClick={(e) => toggleDescription(tote.id, e)}>
                          Show Less
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {tote.description.slice(0, 60)}...
                      <button className="show-more-less-btn" onClick={(e) => toggleDescription(tote.id, e)}>
                        Show More
                      </button>
                    </>
                  )}
                </td>
                <td>{tote.status}</td>
                <td>{tote.location}</td>
                <td>{tote.weight}</td>
                <td className="tote-tags">{tote.tags?.length > 0 ? tote.tags.join(", ") : <em>None</em>}</td>
                <td>
                  {tote.images?.length > 0 ? (
                    <div className="image-gallery">
                      {(() => {
                        const img = tote.images[0];
                        const src = img.startsWith("data:") ? img : `data:image/png;base64,${img}`;
                        return (
                          <img
                            src={src}
                            alt={`Tote ${tote.barcode} image 1`}
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage(src);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                setZoomedImage(src);
                              }
                            }}
                          />
                        );
                      })()}
                    </div>
                  ) : (
                    <em className="tote-no-images">No images</em>
                  )}
                </td>
                <td>
                  {tote.qr_image ? (
                    <img
                      src={`data:image/png;base64,${tote.qr_image}`}
                      alt={`QR code for ${tote.barcode}`}
                      className="qr-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(`data:image/png;base64,${tote.qr_image}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setZoomedImage(`data:image/png;base64,${tote.qr_image}`);
                        }
                      }}
                    />
                  ) : (
                    <em className="tote-no-qr">No QR</em>
                  )}
                </td>
                <td className="action-buttons">
                  <button className="delete-btn" onClick={(e) => handleDelete(tote.id, e)} aria-label={`Delete tote ${tote.barcode}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {zoomedImage && (
        <div
          className="zoom-overlay"
          onClick={() => setZoomedImage(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setZoomedImage(null);
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <img src={zoomedImage} alt="Zoomed tote" />
        </div>
      )}

      <div className="add-tote-bottom-container">
        <Link to="/create">
          <button className="add-tote-btn">+ Add New Tote</button>
        </Link>
      </div>
    </div>
  );
}
