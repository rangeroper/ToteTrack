import React, { useState, useEffect } from "react";
import "./FilterSortBar.css";

const sortOptions = [
  { value: "barcode_asc", label: "Barcode (A-Z)" },
  { value: "barcode_desc", label: "Barcode (Z-A)" },
  { value: "weight_asc", label: "Weight (Low to High)" },
  { value: "weight_desc", label: "Weight (High to Low)" },
  { value: "location_asc", label: "Location (A-Z)" },
  { value: "location_desc", label: "Location (Z-A)" },
  { value: "tags_asc", label: "Tags (A-Z)" },
  { value: "tags_desc", label: "Tags (Z-A)" },
];

export default function FilterSortBar({ totes, onFilteredChange }) {
  const [filterText, setFilterText] = useState("");
  const [sortValue, setSortValue] = useState("");

  const [selectedTag, setSelectedTag] = useState("");
  const [weightCondition, setWeightCondition] = useState("any");
  const [weightThreshold, setWeightThreshold] = useState("");
  const [imageFilter, setImageFilter] = useState("any");
  const [minImages, setMinImages] = useState('');

  const tagOptions = Array.from(
    new Set(totes.flatMap((t) => t.tags || []))
  ).sort();

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

    if (selectedTag) {
      filtered = filtered.filter((t) => t.tags?.includes(selectedTag));
    }

    if (weightThreshold) {
        const threshold = parseFloat(weightThreshold);
        if (!isNaN(threshold)) {
            if (weightCondition === "any") {
                // Exact match when only weight is selected
                filtered = filtered.filter((t) => t.weight === threshold);
            } else if (weightCondition === "over") {
                filtered = filtered.filter((t) => t.weight > threshold);
            } else if (weightCondition === "under") {
                filtered = filtered.filter((t) => t.weight < threshold);
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
    selectedTag,
    weightCondition,
    weightThreshold,
    imageFilter,
    minImages,
    onFilteredChange,
  ]);

    return (
        <div className="filter-sort-bar">
            {/* Top Row: Search + Sort */}
            <div className="top-row">
                <input
                    type="text"
                    className="filter-input search-input"
                    placeholder="Search barcode, description, weight, location, or tags..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            {/* Bottom Row: Filters */}
            <div className="bottom-row">
                <select
                    className="filter-select"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="">Filter by Tag</option>
                    {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                    ))}
                </select>

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
                        onChange={(e) => setMinImages(e.target.value)}
                        value={minImages}
                        />
                    )}
                </div>

            </div>
        </div>
    );

}
