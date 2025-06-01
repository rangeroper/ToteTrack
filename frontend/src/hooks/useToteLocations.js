import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function useToteLocations(initialLocations = []) {
  const [selectedLocations, setSelectedLocations] = useState(initialLocations);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsRes = await axios.get(`${API_BASE_URL}/locations`);
        setAvailableLocations(locationsRes.data.locations.map((location) => location.name));
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationAdd = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
  };

  const handleLocationRemove = (location) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== location));
  };

  return {
    selectedLocations,
    availableLocations,
    setSelectedLocations,
    handleLocationAdd,
    handleLocationRemove,
  };
}
