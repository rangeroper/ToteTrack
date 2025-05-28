import React from "react";
import ToteFormSkeleton from "../components/ToteFormSkeleton";
import useToteForm from "../hooks/useToteForm";
import GenerateBarcode from "../components/GenerateBarcode";

export default function CreateTote() {

  const {
    formData,
    setFormData,
    selectedTags,
    availableTags,
    images,          // images array: [{ file, preview }]
    handleInputChange,
    handleTagAdd,
    handleTagRemove,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
    isLoading,
    submitError,
  } = useToteForm();

  const setBarcode = (barcode) => {
    setFormData(prev => ({ ...prev, barcode }));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h2>Create Tote</h2>
      <GenerateBarcode barcode={formData.barcode} setBarcode={setBarcode} />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ToteFormSkeleton
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
          submitLabel="Create Tote"
          submitError={submitError}
        />
      )}
    </div>
  );
}
