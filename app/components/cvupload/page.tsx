"use client";
import { useState } from "react";
import { Navbar } from "..";
import CVDropZone from "./CVDropZone";
import CVForm from "./CVForm";
import StartButton from "./StartButton";

export default function Home() {
  // State to store the resume file and form data
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    projects: string;
    skills: string;
  } | null>(null);

  // Handle file drop event (from Dropzone)
  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  // Handle form submission (from Form)
  const handleFormSubmit = (data: {
    name: string;
    role: string;
    projects: string;
    skills: string;
  }) => {
    setFormData(data);
  };

  const handleButtonClick = async () => {
    if (!file || !formData) {
      alert("Please complete the form and upload a file.");
      return;
    }

    // Prepare the data for submission (form data and file)
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("projects", formData.projects);
    formDataToSend.append("skill", formData.skills);

    // Call a random API (e.g., JSONPlaceholder for demonstration)
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const data = await response.json();
      console.log("Response:", data); // Handle API response
      alert("Data submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting data");
    }
  };

  return (
    <main className="h-screen items-center bg-primary w-full font-poppins justify-center">
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>
      <section className="bg-primary paddingX flexStart justify-end py-16">
        <section className="boxWidth">
          <CVDropZone onFileDrop={handleFileDrop} />
          <CVForm  /> {/*  onSubmit={handleFormSubmit} */}
          <StartButton
            styles=""
            text="Start Interview"
            onClick={handleButtonClick}
          />
        </section>
      </section>
    </main>
  );
}
