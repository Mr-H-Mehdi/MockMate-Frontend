"use client";

import { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
  Button,
  Separator,
} from "../components/results/UIComponents";
import {
  Download,
  Clock,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Share2,
  Home,
  Sun,
  Moon,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { logo } from "@/public";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Types
interface Question {
  original_question: string;
  user_answer: string;
  feedback: string;
  clarity_score: number;
  relevance_score: number;
  technical_accuracy: number;
}

interface CodingEvaluation {
  approach: string;
  code_quality: string;
  correctness: string;
  efficiency: string;
  suggestions: string;
}
interface interview_metadata {
  interview_role: string;
  skills: string;
  projects: string;
  interviewee: string;
  }

interface InterviewResult {
  status: string;
  feedback?: {
    overview: string;
    questions: Question[];
    coding_evaluation: CodingEvaluation;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    interview_metadata: interview_metadata;
    interview_score: number;
    keywords_missed: string[];
    hiring_recommendation: string;
    generation_timestamp: string;
    processing_time_ms: number;
  };
  message?: string;
  from_cache?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function InterviewResultPage() {
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(5);
  const router = useRouter();

  useEffect(() => {
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
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/auth");
      }
    } else {
      console.log("No user data found in localStorage");
      router.replace("/auth");
    }
  }, [router]);

  // Function to fetch interview results
  const fetchInterviewResults = useCallback(
    async (id: string) => {
      try {
        const requestBody = {
          interview_id: id,
        };

        console.log("Fetching results for interview ID:", id);

        const response = await fetch(`${apiUrl}/api/feedback/get-feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("Server Response:", data);

        setResult(data);
        console.log("data is", data.feedback.data);

        if (data.status === "pending") {
          // Start countdown for the next polling attempt
          setRemainingTime(60);
        } else {
          setIsLoading(false);
        }

        return data;
      } catch (error) {
        console.error("Request failed", error);
        setError("Failed to fetch interview results. Please try again later.");
        setIsLoading(false);
        return null;
      }
    },
    [apiUrl]
  );

  // Effect to initialize interview ID and theme
  useEffect(() => {
    const storedInterviewId = localStorage.getItem("interview_id");

    if (storedInterviewId) {
      setInterviewId(storedInterviewId);
    } else {
      setError("Interview ID not found, results cannot be generated");
      setIsLoading(false);
    }

    // Check user's preferred theme
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
    }
  }, []);

  // Effect to fetch results when interview ID is available
  useEffect(() => {
    // fetchInterviewResults("67cb437d1536951a5108c082");

    if (interviewId) {
      fetchInterviewResults(interviewId);
    }
  }, [interviewId, fetchInterviewResults]);

  // Countdown timer for polling
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (result?.status === "pending" && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [result, remainingTime]);

  // Effect to handle polling when remainingTime reaches zero
  useEffect(() => {
    if (result?.status === "pending" && remainingTime === 0 && interviewId) {
      window.location.reload(); // This will reload the current page

      // fetchInterviewResults(interviewId);
    }
  }, [remainingTime, result, interviewId, fetchInterviewResults]);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleManualRefresh = () => {
    window.location.reload(); // This will reload the current page
    // if (interviewId) {
    //   setIsLoading(true);
    //   fetchInterviewResults(interviewId);
    // }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("interview-result");
    if (!element) return;

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;

      // Get the total height of the element
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate dimensions to fit the page width
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Split into multiple pages if needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        pageCount++;
        position = -pageHeight * pageCount;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("interview-result.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Show pending processing state
  if (result?.status === "pending") {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center max-w-md">
          <div
            className={`animate-spin h-12 w-12 border-4 ${
              darkMode
                ? "border-blue-400 border-t-gray-900"
                : "border-blue-500 border-t-transparent"
            } rounded-full mx-auto mb-4`}
          ></div>
          <h2 className="text-xl font-bold mb-2 text-secondary">
            Interview Results Processing
          </h2>
          <p className="mb-4 text-gray-300">
            Your interview is currently being analyzed by our AI. This typically
            takes 8-10 seconds.
          </p>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>Auto-refreshing in {remainingTime}s</span>
            </div>
            <Progress
              value={100 - (remainingTime / 5) * 100}
              className="h-2"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 mx-6 p-4"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="h-4 w-4  " />
            Home
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleManualRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Now
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin h-12 w-12 border-4 ${
              darkMode
                ? "border-blue-400 border-t-gray-900"
                : "border-blue-500 border-t-transparent"
            } rounded-full mx-auto mb-4`}
          ></div>
          <p className="text-lg">Loading interview results...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !result || !result.feedback) {
    console.log(result?.feedback);

    const errorMessage =
      error || "Failed to load interview results. Please try again later.";

    return (
      <div
        className={`fixed inset-0 flex items-center justify-center min-h-screen z-50 ${
          darkMode ? "bg-black bg-opacity-86 " : "bg-black-900 bg-opacity-75"
        }`}
      >
        <div className="w-full max-w-lg bg-gray-800  rounded-lg">
          <div className="p-4">
            <CardHeader>
              <CardTitle className="text-center text-red-500">
                ⚠️ Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-white">{errorMessage}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Dashboard
              </button>
              <div className="mx-4"></div>
              <button
                onClick={handleManualRefresh}
                className="px-6 py-2 rounded-lg bg-white  hover:bg-gray-300"
              >
                ↻ Retry
              </button>
            </CardFooter>
          </div>
        </div>
      </div>
    );
  }

  // Processing successful results
  // Replace the section where you're processing the feedback data (around line 410-425)

// Processing successful results
var { feedback } = result;
console.log("SSSSS", feedback);

// Debug: Log the entire feedback structure to see where the role might be
console.log("Complete feedback structure:", JSON.stringify(feedback, null, 2));

// Check if feedback exists and has the expected structure
if (!feedback) {
  setError("Invalid feedback data format");
  return;
}

// Check various possible paths where interview_role might be located
let interviewRole = "Not Specified";
if (feedback.interview_metadata?.interview_role) {
  interviewRole = feedback.interview_metadata.interview_role;
} else if (feedback.data?.interview_metadata?.interview_role) {
  interviewRole = feedback.data.interview_metadata.interview_role;
} else if (feedback.data?.data?.interview_metadata?.interview_role) {
  interviewRole = feedback.data.data.interview_metadata.interview_role;
}

console.log("Found interview role:", interviewRole);

// Make sure all required properties exist with default values
const ensureFeedbackData = () => {
  // Create a default structure for interview_metadata if it doesn't exist
  if (!feedback.interview_metadata) {
    feedback.interview_metadata = {
      interview_role: interviewRole, // Use the found role instead of default
      skills: "",
      projects: "",
      interviewee: ""
    };
  } else {
    // Ensure interview_role exists even if interview_metadata does
    feedback.interview_metadata.interview_role = interviewRole; // Use the found role
    feedback.interview_metadata.skills = feedback.interview_metadata.skills || "";
    feedback.interview_metadata.projects = feedback.interview_metadata.projects || "";
    feedback.interview_metadata.interviewee = feedback.interview_metadata.interviewee || "";
  }

  // Ensure coding_evaluation exists with all required fields
  if (!feedback.coding_evaluation) {
    feedback.coding_evaluation = {
      approach: "Not evaluated",
      code_quality: "Not evaluated",
      correctness: "Not evaluated",
      efficiency: "Not evaluated",
      suggestions: "No suggestions provided"
    };
  }

  // Ensure arrays exist
  feedback.strengths = Array.isArray(feedback.strengths) ? feedback.strengths : [];
  feedback.weaknesses = Array.isArray(feedback.weaknesses) ? feedback.weaknesses : [];
  feedback.recommendations = Array.isArray(feedback.recommendations) ? feedback.recommendations : [];
  feedback.keywords_missed = Array.isArray(feedback.keywords_missed) ? feedback.keywords_missed : [];
  feedback.questions = Array.isArray(feedback.questions) ? feedback.questions : [];

  // Ensure numeric and string values
  feedback.interview_score = feedback.interview_score || 0;
  feedback.hiring_recommendation = feedback.hiring_recommendation || "No recommendation provided";
  feedback.generation_timestamp = feedback.generation_timestamp || new Date().toISOString();
  feedback.processing_time_ms = feedback.processing_time_ms || 0;
  feedback.overview = feedback.overview || "No overview provided";

  return feedback;
};

// Check if data property exists and use that structure, otherwise use original
if (feedback.data) {
  console.log("Found feedback.data structure, using that");
  feedback = feedback.data;
}

// Ensure all required properties exist
feedback = ensureFeedbackData();

// Format the date AFTER ensuring feedback structure
const interviewDate = new Date(feedback.generation_timestamp);
const formattedDate = interviewDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const processingTimeMinutes = (feedback.processing_time_ms / 60000).toFixed(2);
console.log("Processed feedback:", feedback);
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => router.push("/dashboard")}
            >
              <Home className={`h-4 w-4 ${darkMode ? "" : "text-black"}} `} />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src={logo}
                  alt="MockMate Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">MockMate</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-1"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div
          id="interview-result"
          className={`space-y-6 ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
          }`}
        >
          {/* Header Card */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-cyan-700 to-indigo-800"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-600"
              } text-white rounded-t-lg`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/20 p-1">
                    <Image
                      src={logo}
                      alt="MockMate Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-cyan-200">
    {feedback.interview_metadata.interview_role}
                    </CardTitle>
                    <CardDescription className="text-white text-lg font-bold pt-2"> {user!.name}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-blue-100 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="inline-flex items-center">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {feedback.interview_score}/100
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`pt-6 ${darkMode ? "text-gray-300" : ""}`}>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2 mt-4">
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Overall Score
                  </h3>
                  <span className="text-sm font-medium">
                    {feedback.interview_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-300 h-2">
                  <div
                    style={{
                      width: `${(feedback.interview_score / 100) * 100}%`, // Calculate width based on interview_score
                      height: "100%",
                      backgroundColor:
                        feedback.interview_score < 40
                          ? darkMode
                            ? "#b91c1c"
                            : "#fca5a5"
                          : feedback.interview_score < 70
                          ? darkMode
                            ? "#ca8a04"
                            : "#fcd34d"
                          : darkMode
                          ? "#16a34a"
                          : "#86efac",
                    }}
                  />
                </div>
              </div>

              <div
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {feedback.overview}
              </div>

              <div
                className={`mt-4 pt-4 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Hiring Recommendation
                </h3>
                <div className="flex items-start gap-2">
                  {feedback.interview_score < 60 ? (
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        darkMode ? "text-red-400" : "text-red-500"
                      } flex-shrink-0 mt-0.5`}
                    />
                  ) : (
                    <CheckCircle
                      className={`h-5 w-5 ${
                        darkMode ? "text-green-400" : "text-green-500"
                      } flex-shrink-0 mt-0.5`}
                    />
                  )}
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feedback.hiring_recommendation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle
                  className={`${
                    darkMode ? "text-green-400" : "text-green-600"
                  } flex items-center gap-2`}
                >
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span
                        className={`${
                          darkMode ? "text-green-400" : "text-green-600"
                        } font-medium text-lg leading-none`}
                      >
                        •
                      </span>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle
                  className={`${
                    darkMode ? "text-red-400" : "text-red-600"
                  } flex items-center gap-2`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span
                        className={`${
                          darkMode ? "text-red-400" : "text-red-600"
                        } font-medium text-lg leading-none`}
                      >
                        •
                      </span>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {weakness}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Coding Evaluation */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>
                Coding Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Approach
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feedback.coding_evaluation.approach}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Code Quality
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feedback.coding_evaluation.code_quality}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Correctness
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feedback.coding_evaluation.correctness}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Efficiency
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feedback.coding_evaluation.efficiency}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 pt-4 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-1`}
                >
                  Suggestions
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {feedback.coding_evaluation.suggestions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keywords Missed */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>
                Keywords Missed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {feedback.keywords_missed.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={
                      darkMode
                        ? "bg-red-900/30 text-red-400 border-red-700"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <BarChart2
                      className={`h-4 w-4 ${
                        darkMode ? "text-blue-400" : "text-blue-500"
                      } flex-shrink-0 mt-0.5`}
                    />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Question Responses - Moved to the end */}
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>
                Question Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedback.questions.map((question, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 shadow-sm ${
                      darkMode
                        ? "border-gray-700 bg-gray-800/50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <h3
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      {question.original_question}
                    </h3>
                    <div
                      className={`pl-4 border-l-2 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      } mb-3`}
                    >
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-700"
                        } italic`}
                      >
                        "{question.user_answer}"
                      </p>
                    </div>

                    <div className="mb-4">
                      <p
                        className={`text-sm ${
                          darkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      >
                        <span className="font-bold"> Remarks:</span>{" "}
                        {question.feedback}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <ScoreCard
                        title="Clarity"
                        score={question.clarity_score}
                        maxScore={10}
                        darkMode={darkMode}
                      />
                      <ScoreCard
                        title="Relevance"
                        score={question.relevance_score}
                        maxScore={10}
                        darkMode={darkMode}
                      />
                      <ScoreCard
                        title="Technical"
                        score={question.technical_accuracy}
                        maxScore={10}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div
            className={`text-center text-xs ${
              darkMode ? "text-gray-500" : "text-gray-500"
            } mt-8`}
          >
            <p>Interview conducted on {formattedDate}</p>
            <p>Processing time: {processingTimeMinutes} minutes</p>
            <div className="flex justify-center items-center mt-2">
              <div className="relative h-6 w-6 mr-1">
                <Image
                  src={logo}
                  alt="MockMate Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p>MockMate Interview Report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for score display
function ScoreCard({
  title,
  score,
  maxScore,
  darkMode,
}: {
  title: string;
  score: number;
  maxScore: number;
  darkMode: boolean;
}) {
  const percentage = (score / maxScore) * 100;
  let color;

  if (percentage < 40) {
    color = darkMode ? "text-red-400" : "text-red-600";
  } else if (percentage < 70) {
    color = darkMode ? "text-yellow-400" : "text-yellow-600";
  } else {
    color = darkMode ? "text-green-400" : "text-green-600";
  }

  return (
    <div
      className={`rounded p-2 text-center ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <div
        className={`text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } mb-1`}
      >
        {title}
      </div>
      <div className={`font-medium ${color}`}>
        {score}/{maxScore}
      </div>
    </div>
  );
}
