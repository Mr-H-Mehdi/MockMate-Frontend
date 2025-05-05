"use client"; // Make sure it's a client component to use hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/home/Navbar";
import InterviewCard from "../components/dashboard/InterviewCard";
import { FaUserCog, FaPlay, FaHistory } from "react-icons/fa";
import { Footer } from "../components/home";
import { useTheme } from "../components/home/ThemeContext";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_BASE_URL;

interface User {
  id: string;
  name: string;
  email: string;
}

interface Interview {
  _id: string;
  interview_role: string;
  total_questions: number;
  interview_score: number;
  skills: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const { theme } = useTheme();

  useEffect(() => {
    // Get theme preference from localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      // Apply theme to document
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
      document.documentElement.classList.toggle(
        "light",
        storedTheme === "light"
      );
    }

    // Get user data from localStorage
    const storedUserStr = localStorage.getItem("user");
    console.log("Raw stored user data:", storedUserStr);

    if (storedUserStr) {
      try {
        // Parse the user data
        const userData = JSON.parse(storedUserStr) as User;
        console.log("Parsed user data:", userData);

        // Set user state
        setUser(userData);

        // Fetch interviews for this user
        fetchUserInterviews(userData.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/auth");
      }
    } else {
      console.log("No user data found in localStorage");
      router.replace("/auth");
    }
  }, [router]);

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

  const fetchUserInterviews = async (userId: string) => {
    try {
      console.log(`Fetching interviews for user: ${userId}`);
      setLoading(true);

      const response = await fetch(`${apiUrl}/api/interview/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch interviews: ${response.statusText}`);
      }

      const result = await response.json();
      const data = result.data;
      console.log("Fetched interviews:", data);

      // Ensure interviews is an array
      if (data && Array.isArray(data)) {
        setInterviews(data);
      } else if (data && data.interviews && Array.isArray(data.interviews)) {
        // If API returns { interviews: [...] } format
        setInterviews(data.interviews);
      } else {
        console.error("Interviews data is not in expected format:", data);
        setInterviews([]);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    localStorage.setItem("interview_id", id);
    router.push("/results");
  };

  // Ensure we're working with arrays before calling slice
  const interviewList = Array.isArray(interviews) ? interviews : [];
  const hasInterviews = interviewList.length > 0;
  const recentInterviews = interviewList.slice(0, 3);
  const olderInterviews = interviewList.slice(3);

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black dark" : "bg-gray-50 light"
        } ${theme === "dark" ? "text-white" : "text-gray-800"} theme-transition`}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg">
        <Navbar />
        <div />
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1
              className={`text-3xl font-bold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                }`}
            >
              {user ? `Welcome back, ${user.name}` : "Welcome"}
            </h1>
            <p
              className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mt-2`}
            >
              {hasInterviews
                ? "Your recent interview sessions are displayed below."
                : "Start your first interview session to get personalized feedback."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => router.push("/resume-upload")}
              className={`flex items-center px-6 py-3 ${theme === "dark"
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                } font-medium rounded-lg shadow-sm transition-colors duration-200`}
            >
              <FaPlay className="mr-2" /> Start a New Interview
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={`flex items-center px-6 py-3 ${theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-600"
                : "bg-white hover:bg-gray-100 text-cyan-600 border border-cyan-500"
                } font-medium rounded-lg shadow-sm transition-colors duration-200`}
            >
              <FaUserCog className="mr-2" /> Profile Settings
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === "dark" ? "border-cyan-500" : "border-cyan-600"
                  } mx-auto mb-4`}
              ></div>
              <p
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Loading your interviews...
              </p>
            </div>
          )}

          {/* Interviews or No Interviews Message */}
          {!loading &&
            (hasInterviews ? (
              <>
                {/* Recent Interviews */}
                <div className="mb-8">
                  <h2
                    className={`text-2xl font-semibold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                      } mb-4 flex items-center`}
                  >
                    <FaHistory className="mr-2" /> Recent Interviews
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentInterviews.map((interview) => (
                      <InterviewCard
                        key={interview._id}
                        interview={interview}
                        onViewDetails={handleViewDetails}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>

                {/* Older Interviews */}
                {olderInterviews.length > 0 && (
                  <div className="mt-12">
                    <h2
                      className={`text-2xl font-semibold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                        } mb-4 flex items-center`}
                    >
                      <FaHistory className="mr-2" /> Older Interviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {olderInterviews.map((interview) => (
                        <InterviewCard
                          key={interview._id}
                          interview={interview}
                          onViewDetails={handleViewDetails}
                          theme={theme}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className={`${theme === "dark"
                  ? "bg-gray-900 border border-gray-800"
                  : "bg-white border border-gray-200"
                  } rounded-xl shadow-md p-8 text-center`}
              >
                <div className="flex flex-col items-center justify-center mb-6">
                  <svg
                    className={`w-24 h-24 ${theme === "dark" ? "text-cyan-500" : "text-cyan-600"
                      } mb-4`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                  <h2
                    className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"
                      } mb-2`}
                  >
                    No previous interviews found
                  </h2>
                  <p
                    className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } mb-6`}
                  >
                    Click the "Start a New Interview" button to begin your first
                    interview session.
                  </p>
                  <button
                    onClick={() => router.push("/new-interview")}
                    className={`flex items-center px-6 py-3 ${theme === "dark"
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : "bg-cyan-500 hover:bg-cyan-600 text-white"
                      } font-medium rounded-lg shadow-sm transition-colors duration-200`}
                  >
                    <FaPlay className="mr-2" /> Start a New Interview
                  </button>
                </div>
              </div>
            ))}
        </main>
      </div>
    </div>
  );
}
