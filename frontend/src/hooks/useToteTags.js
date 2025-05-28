import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function useToteTags(initialTags = []) {
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRes = await axios.get(`${API_BASE_URL}/tags`);
        setAvailableTags(tagsRes.data.tags.map((tag) => tag.name));
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleTagAdd = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleTagRemove = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return {
    selectedTags,
    availableTags,
    setSelectedTags,
    handleTagAdd,
    handleTagRemove,
  };
}
