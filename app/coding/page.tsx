"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/interview/SideBar";
import Modal from "../components/interview/Modal";
import CodingEnvironment from "../components/coding/CodingEnvironment";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const CodingPage = () => {
  const router = useRouter();
  const apiRequestMadeRef = useRef(false);

  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(
    "Loading question..."
  );
  const [input, setInput] = useState<string | null>(
    ""
  );
  const [expected_output, setExpectedOutput] = useState<string | null>(
    ""
  );
  const [question_no, setQuestionNo] = useState<string | null>("1");
  const [total_questions, setTotalQuestions] = useState<string | null>("3");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [codingProblems, setCodingProblems] = useState([
    {
      id: 1,
      title: "Loading...",
      description: "Loading problem description...",
      starterCode: "// Loading...",
      language: "javascript",
      input: "",
      expected_output: "",
    },
  ]);
  const [isSubmitConfirmationModalOpen, setIsSubmitConfirmationModalOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState({ code: "", language: "" });

  useEffect(() => {
    // Use a ref to track if the API request has already been made
    if (apiRequestMadeRef.current) {
      return; // Skip if the request has already been made
    }

    // Load the interview ID from local storage if available
    const storedInterviewId = localStorage.getItem("interview_id");
    console.log("interview id");

    if (storedInterviewId) {
      setInterviewId(storedInterviewId);
      console.log("Hello1");

      // Mark that we're making the API request
      apiRequestMadeRef.current = true;

      // Fetch the coding question from the API
      fetchCodingQuestion(storedInterviewId, "javascript");
    } else {
      // Handle case where interview_id is not available
      setQuestion(
        "Error: No interview ID found. Please start a new interview."
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Update the question when the current problem index changes
    if (codingProblems.length > 0 && !isLoading) {
      const problem = codingProblems[currentProblemIndex];
      setQuestion(`> ${problem.title}\n\n${problem.description}`);
      setQuestion(`> ${problem.title}\n\n${problem.description}`);
    }
  }, [currentProblemIndex, codingProblems, isLoading]);

  const fetchCodingQuestion = async (
    interview_id: string,
    language: string
  ) => {
    setIsLoading(true);

    try {
      console.log(
        `Fetching coding question from ${apiUrl}/api/coding/generate-question`
      );
      
      const formData = new FormData();
      formData.append("interview_id", interview_id);
      formData.append("language", language);
      
      console.log(
        `data id ${interview_id} lang: ${language}`
      );
      // Manually build the query string
      const queryParams = new URLSearchParams();

      // Iterate over the formData and append key-value pairs
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          queryParams.append(key, value); // Append the actual value to queryParams
        }
      });

      const response = await fetch(
        `${apiUrl}/api/coding/generate-question?interview_id=${encodeURIComponent(
          interview_id
        )}&language=${encodeURIComponent(language)}`,
        {
          method: "GET",
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.data) {
        const {
          question,
          input,
          expected_output,
          function_template,
          language,
        } = result.data;

        // Update the coding problems array with the fetched data
        setCodingProblems([
          {
            id: 1,
            title: question.split("\n")[0] || "Coding Problem",
            description: "",
            starterCode: function_template || "// Write your solution here",
            language: language || "javascript",
            input: input || "",
            expected_output: expected_output || "",
          },
        ]);

        // Set the question for the sidebar
        setQuestion(
          `> ${question.split("\n")[0] || "Coding Problem"}\n\n${question}`
        );
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching coding question:", error);
      setQuestion("Error loading question. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
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

  const showSubmitConfirmation = (code: any, language: string) => {
    setPendingSubmission({ code, language });
    setIsSubmitConfirmationModalOpen(true);
  };

  const handleCodeSubmit = async (code: any, language: string) => {
    // Close the confirmation modal
    
    console.log(`Submitting ${language} code solution:`, code);
    
    // Create payload for API call
    const payload = {
      interview_id: interviewId,
      code: code,
    };
    
    // Log the payload (for demo purposes)
    console.log("API payload:", payload);
    
    const requestBody = {
      interview_id: interviewId,
      user_code: code,
    };
    
    // Check if interviewId and code are not undefined
    router.replace("/results");
    setIsSubmitConfirmationModalOpen(false);
    if (interviewId && code) {
      console.log("Interview ID:", interviewId);
      console.log("Code solution:", code);
      
      fetch(`${apiUrl}/api/feedback/detailed-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify(requestBody), // Stringify the request body
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server Response:", data);
          if (data.status === "success") {
            console.log("Code processed successfully!");
          } else {
            console.error("Server error:", data.message);
          }
        })
        .catch((error) => {
          console.error("Request failed", error);
        });
    } else {
      console.error("Invalid input: Missing interviewId or code.");
    }

    // Simulate API call
    console.log(`Sending code to ${apiUrl}/api/coding/evaluate-code`);

    // Move to the next problem or show completion
    if (currentProblemIndex < codingProblems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      // Update question number for the sidebar
      setQuestionNo((currentProblemIndex + 2).toString());
    } else {
      setIsCompletionModalOpen(true);
    }
  };

  const cancelSubmission = () => {
    setIsSubmitConfirmationModalOpen(false);
    setPendingSubmission({ code: "", language: "" });
  };

  return (
    <main className="h-screen overflow-hidden flex items-center bg-primary w-full font-poppins justify-center">
      <Sidebar
      input={codingProblems[0].input}
      expected_output={codingProblems[0].expected_output}
        question={question || "Loading problem..."}
        question_statement="Coding Problem"
        shouldShowReplay={false}
        onTerminate={() => setIsModalOpen(true)}
        onReplay={() => {}} // No replay functionality needed in coding page
        isReplayEnabled={false}
      />

      <div className="flex-1 h-full overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading coding problem...</p>
            </div>
          </div>
        ) : (
          <CodingEnvironment
            initialCode={
              codingProblems[currentProblemIndex]?.starterCode ||
              "// Loading..."
            }
            language={
              codingProblems[currentProblemIndex]?.language || "javascript"
            }
            question={codingProblems[currentProblemIndex]?.description}
            onSubmit={showSubmitConfirmation}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTerminate={handleTerminateInterview}
      />

      {/* Submit Confirmation Modal */}
      {isSubmitConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-blur backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-secondary rounded-lg p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Submit Your Solution?
            </h2>
            <p className="mb-6 text-white">
              Are you sure you want to submit your {pendingSubmission.language} solution? Once submitted, you cannot make changes to this solution.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 rounded-lg bg-secondary text-onSecondary hover:bg-cyan-700"
                onClick={() => handleCodeSubmit(pendingSubmission.code, pendingSubmission.language)}
              >
                Yes, Submit
              </button>
              <button
                className="px-6 py-2 rounded-lg text-cyan-900 bg-gray-100 hover:bg-gray-400"
                onClick={cancelSubmission}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {/* {isCompletionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Coding Assessment Completed!
            </h2>
            <p className="mb-6">
              Congratulations! You've completed all coding challenges. Your
              solutions have been submitted for review.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => router.push("/results")}
              >
                View Results
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => router.push("/")}
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )} */}
    </main>
  );
};

export default CodingPage;