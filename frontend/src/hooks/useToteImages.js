import { useState, useEffect, useRef } from "react";

export default function useToteImages(initialImages = []) {
  const [images, setImages] = useState(initialImages);

  // Keep track of created object URLs to revoke later
  const objectUrlsRef = useRef(new Set());

  // Initialize images with proper preview URLs if given as base64 strings (from API)
  useEffect(() => {
    // For safety: Convert strings to { file: null, preview: string }
    if (initialImages.length > 0) {
      setImages(
        initialImages.map((img) =>
          typeof img === "string"
            ? {
                file: null,
                preview: img.startsWith("data:")
                  ? img
                  : `data:image/jpeg;base64,${img}`,
              }
            : img
        )
      );
    }
  }, [initialImages]);

  const handleImageAdd = (files) => {
    const newImages = Array.from(files).map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.add(preview);
      return { file, preview };
    });

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (previewToRemove) => {
    setImages((prev) => {
      const toRemove = prev.find((img) => img.preview === previewToRemove);
      if (toRemove && toRemove.file) {
        URL.revokeObjectURL(toRemove.preview);
        objectUrlsRef.current.delete(toRemove.preview);
      }
      return prev.filter((img) => img.preview !== previewToRemove);
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  return {
    images,
    setImages,
    handleImageAdd,
    handleImageRemove,
  };
}
