"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../components/home";
import CVDropZone from "../components/resume-upload/CVDropZone";
import CVForm from "../components/resume-upload/CVForm";
import StartButton from "../components/resume-upload/StartButton";
import { useRouter } from "next/navigation";
import { useTheme } from "../components/home/ThemeContext";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_BASE_URL;

// Modal component for success and error messages
const StatusModal = ({ isOpen, onClose, message, isSuccess }:{ isOpen: boolean, onClose: ()=>void , message:string, isSuccess:boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black  backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gray-800  rounded-lg p-6 shadow-lg max-w-md w-full relative ${isSuccess ? 'border-l-4  border-secondary' : 'border-l-4 border-red-500'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="mt-2">
          {isSuccess ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-hoverSecondary flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-white">{message}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-800">{message}</span>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-white ${isSuccess ? 'bg-gradient-to-r from-secondary to-hoverSecondary hover:opacity-90' : 'bg-red-500 hover:bg-red-600'}`}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    projects: string;
    skills: string;
  } | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [role, setRole] = useState("Junior Frontend Developer");
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null);
  const router = useRouter();
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        try {
          // Fetch existing profile
          const response = await fetch(`${apiUrl}/api/profile`, {
            headers: {
              'Authorization': `${localStorage.getItem('authToken')}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            if (profileData) {
              // If profile exists, populate form with existing data
              setFormData({
                name: profileData.name || userData.name || "",
                role: role,
                projects: Array.isArray(profileData.projects) 
                  ? profileData.projects.map((p: any) => p.name).join(", ")
                  : profileData.projects || "",
                skills: Array.isArray(profileData.skills) 
                  ? profileData.skills.join(", ")
                  : profileData.skills || "",
              });
              setIsFormComplete(true);
            } else {
              // If no profile exists, initialize with user's name
              setFormData({
                name: userData.name || "",
                role: role,
                projects: "",
                skills: "",
              });
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Initialize with user's name even if profile fetch fails
          setFormData({
            name: userData.name || "",
            role: role,
            projects: "",
            skills: "",
          });
        }
      } else {
        console.log("No user data found in localStorage");
        router.replace('/auth');
      }
      setIsLoading(false);
    };

    fetchUserAndProfile();
  }, [router, role]);

  useEffect(() => {
    const wakeupServers = () => {
      // Make both requests simultaneously without waiting for each other
      const wakeBackend = fetch(`${apiUrl}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("Backend API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking backend:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeBackend, 300);
        });

      const wakeML = fetch(`${mlApiUrl}/`, {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("ML API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking ML service:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeML, 300);
        });

      // You can use Promise.all to wait for both if needed
      Promise.all([wakeBackend, wakeML])
        .then(() => console.log("Both services are awake"))
        .catch(error => console.log("Error waking services:", error));
    };

    // Initial wake-up call
    wakeupServers();

    // Optional: Set up a periodic ping to keep the services awake
    // This will ping both servers every 14 minutes to prevent them from going idle
    const keepAliveInterval = setInterval(wakeupServers, 14 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(keepAliveInterval);
  }, []);

  const handleFileDrop = (file: File) => {
    setFile(file);  
  };

  const handleFormDataUpdate = (data: any) => {
    if (data.status === 'success' && data.data) {
      setFormData({
        name: data.data.name || user?.name || "",
        role: role,
        projects: data.data.projects || "",
        skills: data.data.skills || "",
      });
    }
  };

  const navigateToInterview = () => {
    router.push("/interview");
  };

  const handleButtonClick = async () => {
    if (!formData) {
      setModalMessage("Please complete the form and upload a file.");
      setIsSuccessModal(false);
      setModalOpen(true);
      return;
    }

    const dataToSend = {
      user_id: user?.id,
      name: formData.name,
      interview_role: role,
      skills: formData.skills,
      projects: formData.projects,
      total_questions: totalQuestions,
    };

    try {
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
      const { interview_id, audio_file_base64, question, question_no, total_questions } = result.message;

      if (audio_file_base64) {
        localStorage.setItem("interview_id", interview_id);
        localStorage.setItem("audio_file_base64", audio_file_base64);
        localStorage.setItem("question", question);
        localStorage.setItem("question_no", String(question_no));
        localStorage.setItem("total_questions", String(total_questions));
      }

      setModalMessage("Interview started successfully!");
      setIsSuccessModal(true);
      setModalOpen(true);
      
      setTimeout(() => {
        navigateToInterview();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("Error starting the interview");
      setIsSuccessModal(false);
      setModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <main className={`h-screen items-center ${ theme==="dark"?"bg-primary":"bg-primary-light"} w-full font-poppins justify-center`}>
      <StatusModal 
        isOpen={modalOpen}
        onClose={isSuccessModal ? navigateToInterview : () => setModalOpen(false)}
        message={modalMessage}
        isSuccess={isSuccessModal}
      />
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>
      <section className={`${ theme==="dark"?"bg-primary":"bg-primary-light"} paddingX flexStart justify-end py-8`}>
        <section className="boxWidth">
          <CVDropZone
            onFileDrop={handleFileDrop}
            onFormDataUpdate={handleFormDataUpdate}
          />
          <CVForm
            initialData={formData}
            setFormData={setFormData}
            setIsFormComplete={setIsFormComplete}
            totalQuestions={totalQuestions}
            role={role}
            setRole={setRole}
            setTotalQuestions={setTotalQuestions}
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