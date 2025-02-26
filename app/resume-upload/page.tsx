"use client";
import { useState } from "react";
import { Navbar } from "../components";
import CVDropZone from "../components/resume-upload/CVDropZone";
import CVForm from "../components/resume-upload/CVForm";
import StartButton from "../components/resume-upload/StartButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    projects: string;
    skills: string;
  } | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  const handleFormDataUpdate = (data: any) => {
    setFormData({
      name: data.name || "",
      role: data.qualification || "",
      projects: data.projects.join(", ") || "",
      skills: data.skills.join(", ") || "",
    });
  };

  const router = useRouter();

  const navigateToInterview = () => {
    // Programmatically navigate to another page (Interview page)
    router.push("/interview");
  };

  const handleButtonClick = async () => {
    if (!file || !formData) {
      alert("Please complete the form and upload a file.");
      return;
    }

    const dataToSend = {
      name: formData.name,
      interview_role: formData.role,
      skills: formData.skills,
      projects: formData.projects,
    };

    console.log("Data to send:", JSON.stringify(dataToSend));

    try {
      console.log(dataToSend);

      const response = await fetch(
        "http://10.7.49.247:3000/api/interview/start-interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start interview");
      }

      const result = await response.json();

      const { user_id, audio_file_base64 } = result.message;

      if (audio_file_base64) {
        // Save to localStorage
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("audio_file_base64", audio_file_base64);
      }

      // Proceed to interview page
      alert("Interview started successfully!");
      navigateToInterview();
    } catch (error) {
      console.error("Error:", error);
      alert("Error starting the interview");
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
            setFormData={setFormData} // Pass down the setFormData function to update form data
            setIsFormComplete={setIsFormComplete} // Pass down the setIsFormComplete function to update status
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
