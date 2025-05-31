import React, { useState, useEffect } from "react";
import "./FilterSortBar.css";

export default function FilterSortBar({ totes, onFilteredChange }) {
  const [filterText, setFilterText] = useState("");
  const [sortValue, setSortValue] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [weightCondition, setWeightCondition] = useState("any");
  const [weightThreshold, setWeightThreshold] = useState("");
  const [imageFilter, setImageFilter] = useState("any");
  const [minImages, setMinImages] = useState("");

  const tagOptions = Array.from(
    new Set(totes.flatMap((t) => t.tags || []))
  ).sort();

    // Derived filters for chip display
    const activeFilters = [
    ...selectedTags.map((tag) => ({
      label: `Tag: ${tag}`,
      key: "tag",
      value: tag,
    })),

    weightThreshold && {
      label:
        weightCondition === "any"
          ? `Weight: ${weightThreshold} lbs`
          : `Weight: ${weightCondition} ${weightThreshold} lbs`,
      key: "weight",
    },
    imageFilter === "none" && { label: "No Images", key: "image_none" },
    imageFilter === "min" &&
      minImages && { label: `Min Images: ${minImages}`, key: "image_min" },
  ].filter(Boolean);

  // Filter logic
  useEffect(() => {
    let filtered = totes;

    const lower = filterText.toLowerCase().trim();
    if (lower) {
      filtered = filtered.filter((t) =>
        (t.barcode && t.barcode.toLowerCase().includes(lower)) ||
        (t.description && t.description.toLowerCase().includes(lower)) ||
        (typeof t.weight === "number" && t.weight.toString().includes(lower)) ||
        (t.location && t.location.toLowerCase().includes(lower)) ||
        (Array.isArray(t.tags) &&
          t.tags.some((tag) => tag.toLowerCase().includes(lower)))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((t) =>
        selectedTags.every((tag) => t.tags?.includes(tag))
      );
    }

    if (weightThreshold) {
      const threshold = parseFloat(weightThreshold);
      if (!isNaN(threshold)) {
        if (weightCondition === "over") {
          filtered = filtered.filter((t) => t.weight > threshold);
        } else if (weightCondition === "under") {
          filtered = filtered.filter((t) => t.weight < threshold);
        } else if (weightCondition === "any") {
          filtered = filtered.filter((t) => t.weight === threshold);
        }
      }
    }

    if (imageFilter === "none") {
      filtered = filtered.filter((t) => !t.images || t.images.length === 0);
    } else if (imageFilter === "min") {
      const min = parseInt(minImages, 10);
      if (!isNaN(min)) {
        filtered = filtered.filter((t) => (t.images?.length || 0) >= min);
      }
    }

    const sorted = [...filtered];
    switch (sortValue) {
      case "barcode_asc":
        sorted.sort((a, b) => (a.barcode || "").localeCompare(b.barcode || ""));
        break;
      case "barcode_desc":
        sorted.sort((a, b) => (b.barcode || "").localeCompare(a.barcode || ""));
        break;
      case "weight_asc":
        sorted.sort((a, b) => (a.weight || 0) - (b.weight || 0));
        break;
      case "weight_desc":
        sorted.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        break;
      case "location_asc":
        sorted.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
        break;
      case "location_desc":
        sorted.sort((a, b) => (b.location || "").localeCompare(a.location || ""));
        break;
      case "tags_asc":
        sorted.sort((a, b) =>
          (a.tags?.join(", ") || "").localeCompare(b.tags?.join(", ") || "")
        );
        break;
      case "tags_desc":
        sorted.sort((a, b) =>
          (b.tags?.join(", ") || "").localeCompare(a.tags?.join(", ") || "")
        );
        break;
      default:
        break;
    }

    onFilteredChange(sorted);
  }, [
    filterText,
    sortValue,
    totes,
    selectedTags,
    weightCondition,
    weightThreshold,
    imageFilter,
    minImages,
    onFilteredChange,
  ]);

  // Remove filter
  const removeFilter = (key, value = null) => {
    switch (key) {
      case "tag":
        if (value) {
          setSelectedTags((prev) => prev.filter((tag) => tag !== value));
        } else {
          setSelectedTags([]);
        }
        break;
      case "weight":
        setWeightThreshold("");
        setWeightCondition("any");
        break;
      case "image_none":
        setImageFilter("any");
        break;
      case "image_min":
        setImageFilter("any");
        setMinImages("");
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setFilterText("");
    setSelectedTags([]);
    setWeightCondition("any");
    setWeightThreshold("");
    setImageFilter("any");
    setMinImages("");
  };

  return (
    <div className="filter-sort-bar">
      {/* Top Row */}
      <div className="top-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search barcode, description, weight, location, or tags..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "+ Filters"}
        </button>
      </div>

      {/* Dynamic Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="tag-filter">Filter by Tag:</label>
            <select
              id="tag-filter"
              className="filter-select"
              value=""
              onChange={(e) => {
                const selectedTag = e.target.value;
                if (selectedTag && !selectedTags.includes(selectedTag)) {
                  setSelectedTags((prev) => [...prev, selectedTag]);
                }
              }}
            >
              <option value="">Select a tag...</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag} disabled={selectedTags.includes(tag)}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={weightCondition}
              onChange={(e) => setWeightCondition(e.target.value)}
            >
              <option value="any">Weight</option>
              <option value="over">Over</option>
              <option value="under">Under</option>
            </select>
            <input
              type="number"
              className="filter-input"
              placeholder="lbs"
              value={weightThreshold}
              onChange={(e) => setWeightThreshold(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value)}
            >
              <option value="any">Images</option>
              <option value="none">No images</option>
              <option value="min">Min # of images</option>
            </select>

            {imageFilter === "min" && (
              <input
                type="number"
                min="1"
                className="filter-input"
                placeholder="#"
                value={minImages}
                onChange={(e) => setMinImages(e.target.value)}
              />
            )}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      <div className="active-filters">
        {activeFilters.map((f) => (
          <button
            key={`${f.key}-${f.value || ""}`}
            className="filter-chip"
            onClick={() => removeFilter(f.key, f.value)}
          >
            {f.label} <span className="remove-x">×</span>
          </button>
        ))}

        {activeFilters.length > 0 && (
          <button
            className="clear-all-filters-btn"
            onClick={clearAllFilters}
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        )}
      </div>

    </div>
  );
}
