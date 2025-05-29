import React, { useState } from "react";

export default function ToteFormSkeleton({
  barcode,
  description,
  status,
  location,
  weight,
  selectedTags,
  availableTags,
  onTagAdd,
  onTagRemove,
  onChange,
  onSubmit,
  submitLabel,
  images,
  onImageAdd,
  onImageRemove,
}) {
  const [zoomedImg, setZoomedImg] = useState(null);
  return (
    <form onSubmit={onSubmit} style={formWrapper}>
      <input
        name="barcode"
        value={barcode ?? ""}
        disabled
        placeholder="Barcode (auto-generated)"
        style={inputStyle}
      />

      <input
        name="description"
        value={description ?? ""}
        onChange={onChange}
        placeholder="Description"
        style={inputStyle}
      />

      <input
        name="status"
        value={status ?? ""}
        onChange={onChange}
        placeholder="Status"
        style={inputStyle}
      />

      <input
        name="location"
        value={location ?? ""}
        onChange={onChange}
        placeholder="Location"
        style={inputStyle}
      />

      <input
        name="weight"
        type="number"
        value={weight ?? ""}
        onChange={onChange}
        placeholder="Weight (lbs)"
        style={inputStyle}
      />

      <label style={labelStyle}>Tags</label>
      <div style={tagWrapperStyle}>
        {selectedTags.map((tag) => (
          <span key={tag} style={tagStyle}>
            {tag}
            <button
              type="button"
              onClick={() => onTagRemove(tag)}
              style={removeButtonStyle}
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value) onTagAdd(value);
            e.target.value = "";
          }}
          style={selectStyle}
          aria-label="Add tag"
        >
          <option value="">Add tag...</option>
          {availableTags
            .filter((tag) => !selectedTags.includes(tag))
            .map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>
      </div>

      <section style={{ marginBottom: 40 }}>
        <label style={{ fontWeight: 'bold', fontSize: 18, display: 'block', marginBottom: 10 }}>
          Images
        </label>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {images &&
            images.map((img, idx) => {
              const src = img.preview || img;

              return (
                <div key={idx} style={imageCardStyle}>
                  <img
                    src={src}
                    alt={`Preview ${idx}`}
                    style={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                    onClick={() => setZoomedImg && setZoomedImg(src)}
                  />
                  <button
                    type="button"
                    onClick={() => onImageRemove(img.preview || img)}
                    style={deleteImageBtn}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

          {/* Image Picker Tile */}
          <label style={plusIconStyle}>
            +
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  onImageAdd(e.target.files);
                  e.target.value = null;
                }
              }}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </section>

      {zoomedImg && (
        <div
          onClick={() => setZoomedImg(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <img src={zoomedImg} style={{ maxWidth: '90%', maxHeight: '90%' }} alt="Zoomed" />
        </div>
      )}

      <button type="submit" style={buttonStyle}>
        {submitLabel}
      </button>
    </form>
  );
}

const formWrapper = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "1.5rem",
  backgroundColor: "#fafafa",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  marginBottom: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "1rem",
  backgroundColor: "#fff",
};

const selectStyle = {
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
};

const fileInputStyle = {
  padding: "0.5rem 0",
  marginBottom: "1.5rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: 500,
  fontSize: "1rem",
};

const tagWrapperStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1.5rem",
};

const tagStyle = {
  backgroundColor: "#e0e7ff",
  color: "#1e3a8a",
  borderRadius: "20px",
  padding: "0.4rem 0.75rem",
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
};

const removeButtonStyle = {
  background: "none",
  border: "none",
  marginLeft: "0.5rem",
  cursor: "pointer",
  color: "#1e3a8a",
  fontSize: "1rem",
  fontWeight: "bold",
};

const buttonStyle = {
  width: "100%",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  backgroundColor: "rgb(0, 123, 255)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const imagePreviewWrapperStyle = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
  marginBottom: "1.5rem",
};

const imagePreviewStyle = {
  position: "relative",
  display: "inline-block",
};

const imageStyle = {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: "50%",
  border: "2px solid #ccc",
};

const imageRemoveButtonStyle = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  border: "none",
  width: 20,
  height: 20,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.875rem",
  lineHeight: "18px",
  textAlign: "center",
  padding: 0,
};

const imageCardStyle = {
  position: 'relative',
  width: 150,
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
};

const deleteImageBtn = {
  position: 'absolute',
  top: 4,
  right: 4,
  background: 'rgba(0,0,0,0.6)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: 24,
  height: 24,
  cursor: 'pointer',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const plusIconStyle = {
  width: 150,
  height: 150,
  border: '2px dashed #ccc',
  borderRadius: 6,
  fontSize: 40,
  color: '#999',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'opacity 0.3s ease',
};
