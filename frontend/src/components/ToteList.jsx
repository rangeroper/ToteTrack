import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // updated here
import FilterSortBar from "./FilterSortBar";
import "../components/ToteList.css";

export default function ToteList() {
  const [totes, setTotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTotes, setFilteredTotes] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate(); // added

  useEffect(() => {
    const fetchTotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/totes`);
        if (!response.ok) throw new Error("Failed to fetch totes");
        const { totes: fetchedTotes } = await response.json();
        setTotes(fetchedTotes);
        setFilteredTotes(fetchedTotes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTotes();
  }, []);

  const handleDelete = async (idToDelete, e) => {
    e.stopPropagation(); // prevent triggering row click
    if (!window.confirm(`Delete tote with ID ${idToDelete}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/totes/${idToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tote");
      setTotes((prev) => prev.filter((t) => t.id !== idToDelete));
      setFilteredTotes((prev) => prev.filter((t) => t.id !== idToDelete));
    } catch (err) {
      alert("Error deleting tote: " + err.message);
    }
  };

  if (loading) return <p>Loading totes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="tote-list-container">
      <div className="tote-list-header">
        <FilterSortBar totes={totes} onFilteredChange={setFilteredTotes} />
      </div>

      <table className="tote-table" aria-label="Tote List Table">
        <thead>
          <tr>
            {[
              "Barcode",
              "Description",
              "Status",
              "Location",
              "Weight",
              "Tags",
              "Images",
              "QR Code",
              "Actions",
            ].map((header) => (
              <th key={header} scope="col">
                {header}
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
                onClick={() => navigate(`/totes/${tote.id}`)} // row click
                style={{ cursor: 'pointer' }}
              >
                <td data-label="Barcode">{tote.barcode}</td>
                <td data-label="Description">{tote.description}</td>
                <td data-label="Status">{tote.status}</td>
                <td data-label="Location">{tote.location}</td>
                <td data-label="Weight">{tote.weight}</td>
                <td data-label="Tags" className="tote-tags">
                  {tote.tags?.length > 0 ? tote.tags.join(", ") : <em>None</em>}
                </td>
                <td data-label="Images">
                  {tote.images?.length > 0 ? (
                    <div className="image-gallery">
                      {tote.images.map((img, i) => {
                        const src = img.startsWith("data:") ? img : `data:image/png;base64,${img}`;
                        return (
                          <img
                            key={i}
                            src={src}
                            alt={`Tote ${tote.barcode} image ${i + 1}`}
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation(); // stop row click
                              setZoomedImage(src);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation(); // stop row click
                                setZoomedImage(src);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <em className="tote-no-images">No images</em>
                  )}
                </td>
                <td data-label="QR Code">
                  {tote.qr_image ? (
                    <img
                      src={`data:image/png;base64,${tote.qr_image}`}
                      alt={`QR code for ${tote.barcode}`}
                      className="qr-image"
                      onClick={(e) => {
                        e.stopPropagation(); // avoid row click
                        setZoomedImage(`data:image/png;base64,${tote.qr_image}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation(); // avoid row click
                          setZoomedImage(`data:image/png;base64,${tote.qr_image}`);
                        }
                      }}
                    />
                  ) : (
                    <em className="tote-no-qr">No QR</em>
                  )}
                </td>
                <td data-label="Actions" className="action-buttons">
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(tote.id, e)}
                    aria-label={`Delete tote ${tote.barcode}`}
                  >
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
