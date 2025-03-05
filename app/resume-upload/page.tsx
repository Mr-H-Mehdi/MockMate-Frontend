"use client";
import { useState } from "react";
import { Navbar } from "../components/home";
import CVDropZone from "../components/resume-upload/CVDropZone";
import CVForm from "../components/resume-upload/CVForm";
import StartButton from "../components/resume-upload/StartButton";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    projects: string;
    skills: string;
  } | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(5); // Add state for number of questions

  const handleFileDrop = (file: File) => {
    setFile(file);
  };

  const handleFormDataUpdate = (data: any) => {

    console.log("dataname1");
    console.log(data.data);
    console.log("dataname2");
    console.log(data.data.name);


    // const content = JSON.parse(data.data);
    // console.log("content");
    // console.log(content);
    // console.log("content name");
    // console.log(content.name);
    
    setFormData({
      name: data.data.name || "",
      role: data.data.qualification || "",
      projects: data.data.projects || "",
      skills: data.data.skills || "",
    });
  };

  const router = useRouter();

  const navigateToInterview = () => {
    router.push("/interview");
  };

  const handleButtonClick = async () => {
    // if (!file || !formData) {
    if (!formData) {
      alert("Please complete the form and upload a file.");
      return;
    }

    const dataToSend = {
      user_id:'67c2348e6639afbc138bfc8c',
      name: formData.name,
      interview_role: formData.role,
      skills: formData.skills,
      projects: formData.projects,
      total_questions: totalQuestions, // Include total_questions in data
    };

    console.log("Data to send:", JSON.stringify(dataToSend));

    try {
      console.log(JSON.stringify(dataToSend));
      
      const response = await fetch(
        `${apiUrl}/api/interview/start-interview`,
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

      const { interview_id, audio_file_base64, question, question_no, total_questions  } = result.message;
      console.log("result:", result);
      console.log("result     q:", question);
      console.log("result     q    no:", question_no);
      console.log("result     q    total:", total_questions);

      if (audio_file_base64) {
        
        localStorage.setItem("interview_id", interview_id);
        localStorage.setItem("audio_file_base64", audio_file_base64);
        localStorage.setItem("question", question);
        localStorage.setItem("question_no", String(question_no));
        localStorage.setItem("total_questions", String(total_questions));
      }

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
      <section className="bg-primary paddingX flexStart justify-end py-8">
        <section className="boxWidth">
          <CVDropZone
            onFileDrop={handleFileDrop}
            onFormDataUpdate={handleFormDataUpdate}
          />
          <CVForm
            initialData={formData}
            setFormData={setFormData}
            setIsFormComplete={setIsFormComplete}
            totalQuestions={totalQuestions} // Pass totalQuestions to CVForm
            setTotalQuestions={setTotalQuestions} // Pass setTotalQuestions to update the state
          />
          <StartButton
            styles=""
            text="Start Interview"
            onClick={handleButtonClick}
            disabled={!isFormComplete}
          />
        </section>
      </section>
    </main>
  );
}
