import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ToteDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tote, setTote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [zoomedImage, setZoomedImage] = useState(null);
    
    useEffect(() => {
        const controller = new AbortController();
        const fetchTote = async () => {
            try {
                const res = await fetch(`http://localhost:8000/totes/${id}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Failed to fetch tote");
                const data = await res.json();
                setTote(data.tote);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTote();
        return () => controller.abort();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleString();
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this tote?")) return;
        setDeleting(true);
        try {
            const res = await fetch(`http://localhost:8000/totes/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to delete tote");
            }
            navigate("/totes");
        } catch (err) {
            alert("Error deleting tote: " + err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            {loading ? (
            <p>Loading...</p>
            ) : error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
            ) : !tote ? (
            <p>Tote not found</p>
            ) : (
            <>
                <h2 style={{ marginBottom: "1rem", color: "#28a745" }}>
                Tote Detail: {tote.barcode}
                </h2>

                {tote.qr_image && (
                <img
                    src={`data:image/png;base64,${tote.qr_image}`}
                    alt={`QR code for tote ${tote.barcode}`}
                    style={{
                    width: "200px",
                    height: "200px",
                    marginBottom: "1rem",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 4,
                    backgroundColor: "#fff",
                    }}
                />
                )}

                <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: "1rem",
                    background: "#fafafa",
                    lineHeight: 1.6,
                }}
                >
                <p><strong>Description:</strong> {tote.description || "N/A"}</p>
                <p><strong>Status:</strong> {tote.status || "N/A"}</p>
                <p><strong>Location:</strong> {tote.location || "N/A"}</p>
                <p><strong>Weight:</strong> {tote.weight ?? "N/A"} lbs</p>
                <p><strong>Tags:</strong> {tote.tags?.length ? tote.tags.join(", ") : "None"}</p>
                <p><strong>Created At:</strong> {formatDate(tote.created_at)}</p>
                <p><strong>Last Updated:</strong> {formatDate(tote.updated_at)}</p>
                </div>

                {tote.images?.length > 0 ? (
                <div style={{ marginTop: "1.5rem" }}>
                    <strong>Images:</strong>
                    <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "0.5rem",
                    }}
                    >
                    {tote.images.map((img, idx) => (
                        <img
                        key={idx}
                        src={img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`}
                        alt={`Tote ${idx + 1}`}
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            cursor: "pointer",
                            borderRadius: 6,
                            border: "1px solid #ccc",
                        }}
                        onClick={() =>
                            setZoomedImage(
                            img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`
                            )
                        }
                        />
                    ))}
                    </div>
                </div>
                ) : (
                <p style={{ marginTop: "1rem" }}><em>No images available</em></p>
                )}

                {zoomedImage && (
                <div
                    onClick={() => setZoomedImage(null)}
                    style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.85)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "zoom-out",
                    zIndex: 1000,
                    }}
                >
                    <img
                    src={zoomedImage}
                    alt="Zoomed tote"
                    style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 8 }}
                    />
                </div>
                )}

                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <button
                    onClick={() => navigate(`/totes/${id}/edit`)}
                    disabled={deleting}
                    style={{
                    padding: "10px 16px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: "bold",
                    cursor: "pointer",
                    }}
                >
                    Edit
                </button>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                    padding: "10px 16px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: "bold",
                    cursor: "pointer",
                    }}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
                </div>
            </>
            )}
        </div>
    );

}
