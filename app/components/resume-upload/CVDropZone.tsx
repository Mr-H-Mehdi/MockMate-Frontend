"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const CVDropZone = ({
  onFileDrop,
  onFormDataUpdate,
}: {
  onFileDrop: (file: File) => void;
  onFormDataUpdate: (data: any) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (isValidFile(file)) {
      setFile(file);
      setError(null);
      onFileDrop(file); // Pass file back to parent component

      // Upload file to the backend
      try {
        const formData = new FormData();
        formData.append("resume", file);

        const response = await fetch("http://localhost:3000/api/resume/upload-resume", {
          method: "POST",
          body: formData,
        });

        // console.log(response);


        if (!response.ok) {
          throw new Error("Failed to upload resume");
        }

        const data = await response.json();
        console.log(data.data);
        onFormDataUpdate(data.data);
      } catch (error) {
        console.error("Error uploading resume:", error);
        setError("Failed to process the resume. Please try again.");
      }
    } else {
      setError("Only DOCX and PDF files are allowed.");
    }
  };

  const isValidFile = (file: File) => {
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
    <div className="p-7 w-full mx-auto rounded-lg shadow-lg bg-gray-800 text-white">
      <h2 className="text-xl font-semibold text-center mb-4">
        Upload File (PDF or DOCX)
      </h2>
      <div
        {...getRootProps()}
        className="cursor-pointer h-44 border-2 border-solid border-secondary p-16 text-center rounded-lg transition-colors hover:text-primary hover:bg-blue-50 "
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
