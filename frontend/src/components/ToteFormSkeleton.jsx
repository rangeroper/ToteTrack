import React, { useState } from "react";
import { X, PlusCircle, Trash2, ArrowLeft } from "lucide-react";

export default function ToteFormSkeleton({
  barcode,
  description,
  status,
  location,
  weight,
  selectedLocations,
  availableLocations,
  onLocationAdd,
  onLocationRemove,
  selectedStatus,
  availableStatus,
  onStatusAdd,
  onStatusRemove,
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
  const [descriptionInvalid, setDescriptionInvalid] = useState(false);

  // Called on blur to check if description is empty
  function handleDescriptionBlur(e) {
    setDescriptionInvalid(!e.target.value.trim());
  }

  // Clear description field & mark invalid
  function clearDescription() {
    onChange({ target: { name: "description", value: "" } });
    setDescriptionInvalid(true);
  }

  return (
    <form onSubmit={onSubmit} style={formWrapper}>
      <input
        name="barcode"
        value={barcode ?? ""}
        disabled
        placeholder="Barcode (auto-generated)"
        style={inputStyle}
      />

      {/* Description input wrapper to position icon */}
      <div style={{ position: "relative", width: "100%", marginBottom: "0.25rem" }}>
        <textarea
          name="description"
          value={description ?? ""}
          onChange={(e) => {
            onChange(e);
            if (e.target.value.trim()) setDescriptionInvalid(false);
          }}
          onBlur={handleDescriptionBlur}
          placeholder="Description"
          required
          rows={4}
          style={{
            ...inputStyle,
            paddingRight: "2.5rem", // space for icon
            borderColor: descriptionInvalid ? "#dc2626" : inputStyle.borderColor,
            resize: "vertical",
            height: "auto", 
            lineHeight: "1.5",
            minHeight: "100px",
          }}
          
          // Disable native validation tooltip, let custom handle it
          onInvalid={(e) => e.preventDefault()}
        />

        {/* Show Lucide X icon if invalid */}
        {descriptionInvalid && (
        <button
          type="button"
          onClick={clearDescription}
          aria-label="Clear description"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-60%)",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0, // Remove vertical offset
            height: "100%",
            width: 24,
          }}
        >
          <X size={20} strokeWidth={4} color="#dc2626" />
        </button>
      )}
      </div>

      {/* Error message below input */}
      {descriptionInvalid && (
        <div
          style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            marginBottom: "1rem",
            width: "95%",
          }}
          role="alert"
        >
          Description is required.
        </div>
      )}
    
      {/* Status select */}
      <label style={labelStyle}>Status</label>
      <div style={tagWrapperStyle}>
        {selectedStatus.map((s) => (
          <span key={s} style={tagStyle}>
            {s}
            <button
              type="button"
              onClick={() => onStatusRemove(s)}
              style={removeButtonStyle}
              aria-label={`Remove status ${s}`}
            >
              ×
            </button>
          </span>
        ))}

        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              onStatusAdd(value);
            }
            e.target.value = "";
          }}
          style={selectStyle}
          aria-label="Add status"
        >
          <option value="">Add status...</option>
          {availableStatus
            .filter((status) => !selectedStatus.includes(status))
            .map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
        </select>
      </div>

      {/* Location select */}
      <label style={labelStyle}>Locations</label>
      <div style={tagWrapperStyle}>
        {selectedLocations.map((loc) => (
          <span key={loc} style={tagStyle}>
            {loc}
            <button
              type="button"
              onClick={() => onLocationRemove(loc)}
              style={removeButtonStyle}
              aria-label={`Remove location ${loc}`}
            >
              ×
            </button>
          </span>
        ))}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value) onLocationAdd(value);
            e.target.value = "";
          }}
          style={selectStyle}
          aria-label="Add location"
        >
          <option value="">Add location...</option>
          {availableLocations
            .filter((loc) => !selectedLocations.includes(loc))
            .map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
        </select>
      </div>

      <input
        name="weight"
        type="number"
        value={weight ?? ""}
        onChange={onChange}
        placeholder="Weight (lbs)"
        style={{
          ...inputStyle,
          width: "33.33%",
        }}
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
            <PlusCircle size={40} strokeWidth={1.5} color="#999" />
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
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
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
  width: "33.33%",
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
  marginBottom: "0.5rem",
  // ensure it stretches full width
  width: "100%",
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
