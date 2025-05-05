"use client";
import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/home";
import VisualizerOne from "../components/interview/VisualizerOne";
import VisualizerTwo from "../components/interview/VisualizerTwo";
import Image from "next/image";
import { logo } from "@/public";
import Modal from "../components/interview/Modal";
import Sidebar from "../components/interview/SideBar";
import MainContent from "../components/interview/MainContent";
import { useRouter } from "next/navigation";
import { useTheme } from "../components/home/ThemeContext";

// Add global styles for animations
const animationStyles = `
@keyframes visualizerAnimation {
  0% {
    height: 5px;
  }
  100% {
    height: 30px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
}
`;

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const InterviewPage = () => {
  const router = useRouter();

  const [interviewData, setInterviewData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [question_no, setQuestionNo] = useState<string | null>("0");
  const [total_questions, setTotalQuestions] = useState<string | null>("0");
  const [audioFileBase64, setAudioFileBase64] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlayed, setIsAudioPlayed] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isIntervieweeDisabled, setIsIntervieweeDisabled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [buttonText, setButtonText] = useState("🎙️ Start Recording");
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Use a ref to track if recording was discarded
  const isDiscardedRef = useRef(false);

  const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.log("No user data found in localStorage");
      router.replace('/auth');
    }
  }, [router]);

  useEffect(() => {
    // Set page as loaded after a short delay for animations
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedInterviewId = localStorage.getItem("interview_id");
    const storedQuestion = localStorage.getItem("question");
    const storedAudioFileBase64 = localStorage.getItem("audio_file_base64");
    const storedQuestionNo = localStorage.getItem("question_no");
    const storedTotalQuestions = localStorage.getItem("total_questions");

    if (storedInterviewId && storedAudioFileBase64) {
      setInterviewId(storedInterviewId);
      setAudioFileBase64(storedAudioFileBase64);
      setQuestion(storedQuestion);
      setQuestionNo(storedQuestionNo);
      setTotalQuestions(storedTotalQuestions);
    }
  }, []);

  useEffect(() => {
    if (interviewId && audioFileBase64) {
      console.log("storedInterviewId:", interviewId);
      console.log("audioFileBase64:", audioFileBase64);

      const audioBlob = base64ToBlob(audioFileBase64, "audio/mp3");
      const audioUrl = URL.createObjectURL(audioBlob);
      setCurrentAudio(audioUrl);
      playAudio(audioUrl);
    }
  }, [audioFileBase64, interviewId]);

  // Check if interview is complete
  useEffect(() => {
    if (question_no && total_questions) {
      const qNum = parseInt(question_no);
      const tQuestions = parseInt(total_questions);

      if (qNum > tQuestions) {
        setIsCompletionModalOpen(true);
      }
    }
  }, [question_no, total_questions]);

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio
      .play()
      .then(() => {
        console.log("Audio is playing...");
        setShouldAnimate(true);
        setIsAudioPlayed(true);
        setIsIntervieweeDisabled(true); // Disable Interviewee section while AI audio plays
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
      
      audio.onended = () => {
        console.log("Audio has ended.");
        setShouldAnimate(false);
      setIsIntervieweeDisabled(false); // Enable Interviewee section once audio ends
      if (audioQueue.length > 0) {
        const nextAudio = audioQueue[0];
        setAudioQueue(audioQueue.slice(1)); // Remove the played audio from the queue
        playAudio(nextAudio); // Play the next audio
      }
    };
  };

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

  const handleTerminateInterview = () => {
    console.log("initiating terminate request with id:", interviewId);
    const requestBody = {
      interview_id: interviewId,
    };


    fetch(`${apiUrl}/api/interview/terminate-interview`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Interview terminated successfully.");
        } else {
          console.log(
            `Failed to terminate interview. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setIsModalOpen(false);
    // Add animation for navigation
    document.body.classList.add('animate__animated', 'animate__fadeOut', 'animate__faster');
    setTimeout(() => {
      router.replace("/dashboard");
    }, 500);
  };

  const handleProceedToCoding = () => {
    // Add animation for navigation
    document.body.classList.add('animate__animated', 'animate__fadeOut', 'animate__faster');
    setTimeout(() => {
      router.push("/coding");
    }, 500);
  };

  const handleRecordingToggle = async () => {
    if (!isRecording) {
      // Start recording
      try {
        // Reset the discard flag when starting a new recording
        isDiscardedRef.current = false;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setMediaStream(stream);
        setPermissionError(null);

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        let chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          console.log("Recording stopped");
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(audioBlob);

          // Reset state
          chunks = [];

          // Only send the recording if we have an interviewId and it wasn't discarded
          if (interviewId && audioBlob && !isDiscardedRef.current) {
            console.log("Sending audio to server...");
            const formData = new FormData();
            formData.append("interview_id", interviewId);
            formData.append("audio", audioBlob);
            console.log("Interview ID:", interviewId);
            console.log("Audio blob size:", audioBlob.size);

            setIsIntervieweeDisabled(true);
            fetch(`${apiUrl}/api/interview/process-response`, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Server Response:", data);
                if (data.status === "success") {
                  console.log("Audio processed successfully!");
                  setAudioFileBase64(data.message.audio_file_base64);
                  setQuestion(data.message.question);
                  setQuestionNo(data.message.question_no);
                  setTotalQuestions(data.message.total_questions);
                } else {
                  console.error("Server error:", data.message);
                }
              })
              .catch((error) => {
                console.error("Error sending audio:", error);
              });
          } else if (isDiscardedRef.current) {
            console.log("Recording was discarded, not sending to server");
          }
        };

        // Start the recording
        recorder.start();
        setIsRecording(true);
        setButtonText("📤 Stop & Send");

        // Start the timer
        const interval = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);

        setTimerInterval(interval);
      } catch (error) {
        console.error("Microphone permission denied", error);
        setPermissionError(
          "Microphone permission denied. Please allow microphone access."
        );
      }
    } else {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("Stopping recording and sending...");
      }

      // Clean up
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      setIsRecording(false);
      setButtonText("🎙️ Start Recording");
      setElapsedTime(0);

      // Stop all tracks on the media stream
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
    }
  };

  const handleDiscardRecording = () => {
    // Set the discard flag to true before stopping the recorder
    isDiscardedRef.current = true;
    console.log("Setting discard flag to true");

    // Stop recording if it's in progress
    if (isRecording && mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      console.log("Recording discarded");
    }

    // Clean up timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Stop all tracks on the media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    // Reset state
    setIsRecording(false);
    setButtonText("🎙️ Start Recording");
    setElapsedTime(0);
    setAudioBlob(null);

    console.log("Recording discarded successfully");
  };

  const handleReplayAudio = () => {
    if (isAudioPlayed && !isRecording && currentAudio) {
      playAudio(currentAudio); // Replay the audio
    }
  };

  const addAudioToQueue = (newAudio: string) => {
    setAudioQueue([...audioQueue, newAudio]); // Add new audio to queue
  };

  const displayQuestionNo = parseInt(question_no!) <= parseInt(total_questions!)
    ? question_no
    : total_questions;



    // const {theme}=useTheme();
    const theme="light";
  return (
    <>
      {/* Add animation styles */}
      <style jsx global>{animationStyles}</style>

      <main className={`h-screen overflow-hidden flex items-center ${theme==="dark"?"bg-primary":"bg-primary-light"} w-full font-poppins justify-center transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Sidebar
        input=""
        expected_output=""
          question={question || "Loading question..."}
          shouldShowReplay={true}
          question_statement={`Question ${displayQuestionNo} out of ${total_questions}`}
          onTerminate={() => setIsModalOpen(true)}
          onReplay={handleReplayAudio} // Pass replay handler to Sidebar
          isReplayEnabled={!isIntervieweeDisabled && isAudioPlayed && !isRecording} // Enable replay if audio played and not recording
        />
        <MainContent
          interviewData={interviewData}
          isIntervieweeDisabled={isIntervieweeDisabled}
          shouldAnimate={shouldAnimate}
          isRecording={isRecording}
          elapsedTime={elapsedTime}
          onStartRecording={handleRecordingToggle}
          onDiscardRecording={handleDiscardRecording}
          buttonText={buttonText} // Pass the button text state to the MainContent
          permissionError={permissionError} // Pass error message to MainContent
        />
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTerminate={handleTerminateInterview}
        />

        {/* Enhanced Completion Modal */}
        {isCompletionModalOpen && (
          <div className="fixed inset-0 bg-black bg-blur backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
            <div className="bg-gray-800 text-white  rounded-lg p-8 max-w-md mx-auto text-center shadow-2xl animate__animated animate__zoomIn">
              <div className="text-5xl mb-4 animate__animated animate__bounceIn animate__delay-1s">🎉</div>
              <h2 className="text-2xl font-bold mb-4 text-secondary ">Interview Completed!</h2>
              <p className="mb-6">
                This concludes the voice interview. Let's proceed to the coding assessment.
              </p>
              <button
                className={`px-6 py-2 rounded-lg transition-all duration-300 text-onSecondary  transform hover:scale-105 ${!isIntervieweeDisabled
                  ? "px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  } animate__animated animate__pulse animate__infinite animate__slow`}
                onClick={handleProceedToCoding}
                disabled={isIntervieweeDisabled}
              >
                Continue to Coding Assessment →
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default InterviewPage;