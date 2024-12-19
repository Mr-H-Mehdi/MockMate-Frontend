"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../components";
import VisualizerOne from "../components/interview/VisualizerOne";
import VisualizerTwo from "../components/interview/VisualizerTwo";

const InterviewPage = () => {
  const [interviewData, setInterviewData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [audioFileBase64, setAudioFileBase64] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve user_id and audio_file_base64 from localStorage
    const storedUserId = localStorage.getItem("user_id");
    const storedAudioFileBase64 = localStorage.getItem("audio_file_base64");

    if (storedUserId && storedAudioFileBase64) {
      setUserId(storedUserId);
      setAudioFileBase64(storedAudioFileBase64);
    }
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    // Log the values of userId and audioFileBase64
    if (userId && audioFileBase64) {
      console.log("userId:", userId);
      console.log("audioFileBase64:", audioFileBase64);

      // Play the audio once the audioFileBase64 is available
      const audioBlob = base64ToBlob(audioFileBase64, "audio/mp3");
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.play()
        .then(() => {
          console.log("Audio is playing...");
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });

      // Optionally, log when the audio ends
      audio.onended = () => {
        console.log("Audio has ended.");
      };
    }
  }, [audioFileBase64, userId]); // Run this effect when either audioFileBase64 or userId changes

  // Helper function to convert base64 to a Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  return (
    <main className="h-screen items-center bg-primary w-full font-poppins justify-center">
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>

      <section className="bg-primary border-inbetween paddingX items-center py-12 flex md:flex-row flex-col paddingY">
        <div className="border border-secondary p-4 flex-1 items-center">
          <VisualizerOne />
        </div>

        <div className="border border-secondary p-4 flex-1">
          <VisualizerTwo />
        </div>
      </section>

      {/* Optionally display the interview data */}
      {interviewData && <div>{JSON.stringify(interviewData)}</div>}
    </main>
  );
};

export default InterviewPage;
