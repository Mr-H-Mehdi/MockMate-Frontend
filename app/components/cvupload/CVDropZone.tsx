// components/CVDropZone.tsx
'use client';

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const CVDropZone = ({ onFileDrop }: { onFileDrop: (file: File) => void }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Handle file drop or file selection
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (isValidFile(file)) {
      setFile(file);
      setError(null);
      onFileDrop(file); // Pass file back to parent component
    } else {
      setError("Only DOCX and PDF files are allowed.");
    }
  };

  // Validate file type
  const isValidFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(file.type);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: ".pdf, .docx", // restrict file types
  });

  return (
    <div className="p-7 w-full mx-auto   rounded-lg shadow-lg bg-gray-800 text-white">
      <h2 className="text-xl font-semibold text-center mb-4">Upload File (PDF or DOCX)</h2>
      <div
        {...getRootProps()}
        className="cursor-pointer h-48 border-2 border-solid border-secondary p-16 text-center rounded-lg transition-colors hover:text-primary hover:bg-blue-50 "
      >
        <input {...getInputProps()} />
        <p>Drag and drop a file here, or click to select a file</p>
      </div>

      {file && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected File:</h3>
          <p className="text-secondary font-bold">{file.name}</p>
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-500 text-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CVDropZone;
