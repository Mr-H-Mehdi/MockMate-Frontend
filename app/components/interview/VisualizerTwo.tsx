// components/VisualizerTwo.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "../../styles/animations";
import { mic1 } from "@/public";


const VisualizerTwo = () => {
  const [isRecording, setIsRecording] = useState(false); // Tracks the recording state
  const [recordingProgress, setRecordingProgress] = useState(0); // Tracks the recording progress
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Stores the audio blob after recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null); // MediaRecorder instance

  // Set up media recorder
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (event) => {
            setAudioBlob(event.data); // Save the audio blob when recording is available
          };
          recorder.onstart = () => {
            setRecordingProgress(0);
          };
          recorder.onstop = () => {
            setRecordingProgress(100); // Set progress to 100 when recording stops
          };
          setMediaRecorder(recorder);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  }, []);

  // Handle recording start and stop
  const handleRecording = () => {
    if (isRecording) {
      mediaRecorder?.stop(); // Stop recording
    } else {
      mediaRecorder?.start(); // Start recording
      const progressInterval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval); // Stop the progress once it reaches 100
            return 100;
          }
          return prev + 1; // Update the progress every 1%
        });
      }, 100);
    }
    setIsRecording(!isRecording);
  };

  // Save the audio blob to file
  const handleSaveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav"; // Save the file as a .wav
      a.click();
      URL.revokeObjectURL(url); // Clean up the URL object
    }
  };



  return (
    <motion.div
          className="flex-1 flexCenter md:my-0 my-10 relative"
          variants={slideIn("right", "tween", 0.2, 1.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Image
            src={mic1}
            alt="billing"
            width={0}
            height={0}
            className="sm:w-[35.5%] w-[35.5%] sm:h-[35.5%] h-[35.5%] relative z-[0]"
            priority={true}
          />
    <div className="absolute top-5 left-5 text-white">
        {isRecording ? (
          <p>Recording... {recordingProgress}%</p>
        ) : (
          <p>Click to Start Recording</p>
        )}
      </div>

      {/* Button to start/stop recording */}
      <button
        onClick={handleRecording}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-3 bg-blue-500 text-white rounded-md"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Button to save the recording */}
      {audioBlob && !isRecording && (
        <button
          onClick={handleSaveRecording}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 p-3 bg-green-500 text-white rounded-md"
        >
          Save Recording
        </button>
      )}
    </motion.div>

  );
};

export default VisualizerTwo;
