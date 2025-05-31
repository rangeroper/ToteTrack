import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ToteFormSkeleton from "../components/ToteFormSkeleton";
import useToteForm from "../hooks/useToteForm";

export default function EditTote() {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const {
    formData,
    selectedTags,
    availableTags,
    images,
    handleInputChange,
    handleTagAdd,
    handleTagRemove,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
    isLoading,
    submitError,
  } = useToteForm(barcode);

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <button
          onClick={() => navigate("/totes")}
          style={{
              padding: "10px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "1.5rem",
          }}
      >
      ← Back to All Totes
      </button>

      <h2>Edit Tote</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ToteFormSkeleton
          mode="edit"
          barcode={formData.barcode}
          description={formData.description}
          status={formData.status}
          location={formData.location}
          weight={formData.weight}
          selectedTags={selectedTags}
          availableTags={availableTags}
          images={images}
          onChange={handleInputChange}
          onTagAdd={handleTagAdd}
          onTagRemove={handleTagRemove}
          onImageAdd={(files) => {
            handleImageAdd(files);
          }}
          onImageRemove={(preview) => {
            handleImageRemove(preview);
          }}
          onSubmit={handleSubmit} 
          submitLabel="Update Tote"
          submitError={submitError}
        />
      )}
    </div>
  );
}
