import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function useToteStatus(initialStatus = []) {
  // Always initialize as an array
  const [selectedStatus, setSelectedStatus] = useState(
    Array.isArray(initialStatus) ? initialStatus : []
  );
  const [availableStatuses, setAvailableStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/statuses`);
        setAvailableStatuses(res.data.statuses.map((status) => status.name));
      } catch (error) {
        console.error("Error loading statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  const handleStatusAdd = (status) => {
    if (!selectedStatus.includes(status)) {
      setSelectedStatus((prev) => [...prev, status]);
    }
  };

  const handleStatusRemove = (status) => {
    setSelectedStatus((prev) => prev.filter((s) => s !== status));
  };

  return {
    selectedStatus,
    availableStatuses,
    setSelectedStatus,
    handleStatusAdd,
    handleStatusRemove,
  };
}
