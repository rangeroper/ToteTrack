import React, { useEffect } from "react";

const generateBarcode = () => {
  return "TOTE-" + Math.random().toString(36).substr(2, 8).toUpperCase();
};

export default function GenerateBarcode({ barcode, setBarcode }) {
  useEffect(() => {
    if (!barcode) {
      setBarcode(generateBarcode());
    }
  }, [barcode, setBarcode]);

  return null; // no UI output
}
