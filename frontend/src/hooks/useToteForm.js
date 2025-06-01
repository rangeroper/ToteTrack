import { useState, useEffect } from "react";
import axios from "axios";
import useToteTags from "./useToteTags";
import useToteImages from "./useToteImages";
import useToteLocations from "./useToteLocations";
import useToteStatuses from "./useToteStatuses";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function useToteForm() {
  const navigate = useNavigate();
  const { id: toteId } = useParams();
  const location = useLocation();

  const isEdit = toteId && location.pathname.endsWith("/edit");

  const [formData, setFormData] = useState({
    barcode: "",
    description: "",
    weight: "",
  });

  const {
    selectedTags,
    availableTags,
    setSelectedTags,
    handleTagAdd,
    handleTagRemove,
  } = useToteTags();

  const {
    images,
    setImages,
    handleImageAdd,
    handleImageRemove,
  } = useToteImages();

  const {
    selectedLocations,
    availableLocations,
    setSelectedLocations,
    handleLocationAdd,
    handleLocationRemove,
  } = useToteLocations();

  const {
    selectedStatus,
    availableStatuses,
    setSelectedStatus,
    handleStatusAdd,
    handleStatusRemove
  } = useToteStatuses();

  const [isLoading, setIsLoading] = useState(isEdit); // start loading if editing
  const [submitError, setSubmitError] = useState(null);

  // Fetch tote data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      setIsLoading(true);
      setSubmitError(null);

      try {
        const toteRes = await axios.get(`${API_BASE_URL}/totes/${toteId}`);
        const tote = toteRes.data.tote;

        setFormData({
          barcode: tote.barcode || "",
          description: tote.description || "",
          weight: tote.weight || "",
        });

        // Set status and locations into their respective states/hooks
        setSelectedStatus(Array.isArray(tote.status) ? tote.status : []);
        setSelectedLocations(Array.isArray(tote.location) ? tote.location : []);
        setSelectedTags(Array.isArray(tote.tags) ? tote.tags : []);

        setImages(
          Array.isArray(tote.images)
            ? tote.images.map((base64Str) => ({
                file: null,
                preview: base64Str.startsWith("data:")
                  ? base64Str
                  : `data:image/jpeg;base64,${base64Str}`,
              }))
            : []
        );
      } catch (error) {
        console.error("Error loading tote data:", error);
        setSubmitError("Failed to load tote data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toteId, isEdit, setSelectedTags, setImages, setSelectedLocations, setSelectedStatus, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.barcode) {
      setSubmitError("Barcode is required.");
      return;
    }

    setSubmitError(null);

    const data = new FormData();

    // Append basic form data fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append selected statuses
    selectedStatus.forEach((status) => data.append("status[]", status));

    // Append selected locations
    selectedLocations.forEach((loc) => data.append("location[]", loc));

    // Append tags
    selectedTags.forEach((tag) => data.append("tags[]", tag));

    // Append existing images as base64/URLs to preserve them
    images
      .filter(({ file }) => file === null)
      .forEach(({ preview }) => {
        const base64Only = preview.startsWith("data:") ? preview.split(",")[1] : preview;
        data.append("existingImages", base64Only);
      });

    // Append new image files
    images
      .filter(({ file }) => file !== null)
      .forEach(({ file }) => {
        data.append("images", file);
      });

    try {
      if (isEdit) {
        await axios.patch(`${API_BASE_URL}/totes/${toteId}`, data);
      } else {
        await axios.post(`${API_BASE_URL}/totes`, data);
      }

      navigate("/totes");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Failed to submit form. Please try again.");
      throw error;
    }
  };

  return {
    formData,
    setFormData,
    selectedTags,
    setSelectedTags,
    availableTags,
    images,
    setImages,
    handleInputChange,
    handleTagAdd,
    handleTagRemove,
    handleImageAdd,
    handleImageRemove,
    selectedLocations,
    availableLocations,
    setSelectedLocations,
    handleLocationAdd,
    handleLocationRemove,
    handleStatusRemove,
    selectedStatus,
    availableStatuses,
    setSelectedStatus,
    handleStatusAdd,
    handleSubmit,
    isEdit,
    isLoading,
    submitError,
  };
}
