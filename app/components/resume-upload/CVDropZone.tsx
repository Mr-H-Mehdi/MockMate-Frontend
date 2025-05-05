"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTheme } from "../home/ThemeContext";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const CVDropZone = ({
  onFileDrop,
  onFormDataUpdate,
}: {
  onFileDrop: (file: File) => void;
  onFormDataUpdate: (data: any) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parseSuccess, setParseSuccess] = useState<boolean>(false);
  const {theme}=useTheme();

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (isValidFile(file)) {
      setFile(file);
      setError(null);
      setIsLoading(true);
      setParseSuccess(false);
      onFileDrop(file); // Pass file back to parent component

      // Upload file to the backend
      try {
        const formData = new FormData();
        formData.append("resume", file);
        console.log("apiUrl");
        console.log(apiUrl);
        
        const response = await fetch(`${apiUrl}/api/resume/upload-resume`, {
          method: "POST",
          body: formData,
        });

        // console.log(response);

        if (!response.ok) {
          throw new Error("Failed to upload resume");
        }

        const data = await response.json();
        onFormDataUpdate(data.data);
        setIsLoading(false);
        setParseSuccess(true);
      } catch (error) {
        console.error("Error uploading resume:", error);
        setError("Failed to process the resume. Please try again.");
        setIsLoading(false);
        setParseSuccess(false);
      }
    } else {
      setError("Only DOCX and PDF files are allowed.");
      setParseSuccess(false);
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
    <div className={`p-7 w-full mx-auto rounded-lg shadow-lg ${theme==="dark"?"bg-gray-800 text-white":"bg-white text-black"} `}>
      <h2 className="text-xl font-semibold text-center mb-4">
        Upload File (PDF or DOCX)
      </h2>
      <div
        {...getRootProps()}
        className={`cursor-pointer h-44 border-2 border-solid border-secondary p-16 text-center rounded-lg transition-colors ${theme==="dark"?"hover:text-primary hover:bg-blue-50 ":"text-black hover:text-primary hover:bg-blue-50"} `}
      >
        <input {...getInputProps()} />
        <p>Drag and drop a file here, or click to select a file</p>
      </div>

      {file && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected File:</h3>
          <div className="flex items-center">
            <p className={`${theme==="dark"?"text-secondary":"text-black"} font-bold`}>{file.name}</p>
            
            {isLoading && (
              <div className="ml-3 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <span className="ml-2 text-blue-400 text-sm">Processing...</span>
              </div>
            )}
            
            {parseSuccess && !isLoading && !error && (
              <div className="ml-3 flex items-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2 text-green-400 text-sm">Successfully parsed</span>
              </div>
            )}
            
            {error && (
              <div className="ml-3 flex items-center">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="ml-2 text-red-400 text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVDropZone;