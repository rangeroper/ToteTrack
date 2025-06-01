import React from "react";
import { useNavigate } from "react-router-dom";
import ToteFormSkeleton from "../components/ToteFormSkeleton";
import useToteForm from "../hooks/useToteForm";

export default function EditTote() {
  const navigate = useNavigate();

  const {
    formData,
    selectedTags,
    availableTags,
    selectedLocations,
    availableLocations,
    handleLocationAdd,
    handleLocationRemove,
    selectedStatus,
    availableStatuses,
    handleStatusRemove,
    handleStatusAdd,
    images,
    handleInputChange,
    handleTagAdd,
    handleTagRemove,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
    isLoading,
    submitError,
  } = useToteForm();

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
          weight={formData.weight}
          selectedTags={selectedTags}
          availableTags={availableTags}
          selectedLocations={selectedLocations}
          availableLocations={availableLocations}
          selectedStatus={selectedStatus}
          availableStatus={availableStatuses}
          images={images}
          onChange={handleInputChange}
          onTagAdd={handleTagAdd}
          onTagRemove={handleTagRemove}
          onLocationAdd={handleLocationAdd}
          onLocationRemove={handleLocationRemove}
          onStatusAdd={handleStatusAdd}
          onStatusRemove={handleStatusRemove}
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
