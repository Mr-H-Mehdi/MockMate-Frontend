import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "../../styles/animations";
import { mic1 } from "@/public";

const VisualizerTwo = () => {
  const [isRecording, setIsRecording] = useState(false); // Tracks the recording state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Stores the audio blob after recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null); // MediaRecorder instance
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Controls if the button is disabled
  const [audioFileBase64, setAudioFileBase64] = useState<string | null>(null); // Stores the base64 audio data from the server response
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Controls the loading state (for circular spinner)

  // Retrieve user_id from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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
            // Reset progress and other states on start
          };
          recorder.onstop = () => {
            // Stop recording logic
            console.log("Recording stopped");

            if (audioBlob) {
              // Disable the record button during the post request and audio playback
              setIsButtonDisabled(true);
              setIsLoading(true); // Start the loading indicator

              // Send the audio blob to the server after recording stops
              const formData = new FormData();
              formData.append("user_id", userId!);
              formData.append("audio", audioBlob);
              fetch("http://10.7.49.247:3000/api/interview/process-response", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Server Response:", data);
                  console.log("Server Response:", data.message.audio_file_base64);

                  if (data.status === "success") {
                    // Set the base64 audio response from the server
                    setAudioFileBase64(data.message.audio_file_base64);
                  }
                })
                .catch((error) => {
                  console.error("Error sending audio:", error);
                  setIsButtonDisabled(false); // Re-enable the button if there was an error
                })
                .finally(() => {
                  setIsLoading(false); // Stop the loading indicator once the response is done
                });
            }
          };
          setMediaRecorder(recorder);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  }, [audioBlob, userId]);

  // Handle recording start and stop
  const handleRecording = () => {
    if (isRecording) {
      mediaRecorder?.stop(); // Stop recording
    } else {
      mediaRecorder?.start(); // Start recording
    }
    setIsRecording(!isRecording);
  };

  // Automatically play the audio when the base64 is set (response from server)
  useEffect(() => {
    if (audioFileBase64) {
      // Convert base64 to a Blob
      const audioBlob = base64ToBlob(audioFileBase64, "audio/mp3");
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Play the audio
      audio.play()
        .then(() => {
          console.log("Audio is playing...");
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });

      // When audio finishes playing, enable the record button again
      audio.onended = () => {
        console.log("Audio has ended.");
        setIsButtonDisabled(false); // Re-enable the button after the audio finishes playing
      };
    }
  }, [audioFileBase64]); // This effect triggers when base64 data is available

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
    <motion.div
      className="flex-1 flexCenter md:my-0 my-10 relative flex flex-col items-center justify-center"
      variants={slideIn("right", "tween", 0.2, 1.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {/* Image of the mic */}
      <Image
        src={mic1}
        alt="billing"
        width={0}
        height={0}
        className="py-7 sm:w-[23.7%] w-[28.8%] sm:h-[28.8%] h-[28.8%] relative z-[0]"
        priority={true}
      />

      {/* Button to start/stop recording */}
      <button
        onClick={handleRecording}
        className={`mt-6 p-3 rounded-md ${isRecording ? "bg-red-500" : "bg-blue-500"} ${isButtonDisabled ? "bg-gray-400" : ""} text-white`}
        disabled={isButtonDisabled}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Loading Spinner when waiting for API response */}
      {isLoading && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-opacity-50 bg-gray-200">
          <div className="w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default VisualizerTwo;
