"use client";
import { useState } from "react";
import { Navbar } from "../components";
import CVDropZone from "../components/cvupload/CVDropZone";
import CVForm from "../components/cvupload/CVForm";
import StartButton from "../components/cvupload/StartButton";

export default function Home() {
  // State to store the resume file and form data
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    projects: string;
    skills: string;
  } | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Handle file drop event (from Dropzone)
  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  // Update form fields with the response from the backend
  const handleFormDataUpdate = (data: any) => {
    setFormData({
      name: data.name || "",
      role: data.qualification || "",
      projects: data.projects.join(", ") || "",
      skills: data.skills.join(", ") || "",
    });
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

  // Handle button click
  const handleButtonClick = async () => {
    if (!file || !formData) {
      alert("Please complete the form and upload a file.");
      return;
    }
  
    // // Set session storage flag
    // sessionStorage.setItem("cameFromCVUpload", "true");
  
    // if (!file || !formData) {
    //   alert("Please complete the form and upload a file.");
    //   return;
    // }

    // Prepare the data for submission (form data and file)
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("projects", formData.projects);
    formDataToSend.append("skill", formData.skills);

    // Call the backend API to submit the data
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
      <section className="bg-primary paddingX flexStart justify-end py-12">
        <section className="boxWidth">
          <CVDropZone
            onFileDrop={handleFileDrop}
            onFormDataUpdate={handleFormDataUpdate}
          />
          <CVForm
            initialData={formData}
            setIsFormComplete={setIsFormComplete} // Pass the function to update isFormComplete
          />
          <StartButton
            styles=""
            text="Start Interview"
            onClick={handleButtonClick}
            disabled={!isFormComplete} // Disable the button if form is incomplete
          />
        </section>
      </section>
    </main>
  );
}
