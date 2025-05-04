// components/interview/Sidebar.tsx
import Image from "next/image";
import { logo } from "@/public";
import { useEffect, useState } from "react";

const Sidebar = ({
  question,
  input,
  expected_output,
  question_statement,
  onTerminate,
  onReplay,
  isReplayEnabled,
  shouldShowReplay,
}: {
  question: string;
  input: string;
  expected_output: string;
  question_statement: string;
  onTerminate: () => void;
  onReplay: () => void;
  isReplayEnabled: boolean;
  shouldShowReplay: boolean;
}) => {
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    // Add delay before showing question for a staggered animation effect
    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[32%] bg-gray-800 text-white p-4 h-full relative transition-all duration-500 ease-out animate__animated animate__fadeInLeft">
      <div className="animate__animated animate__fadeIn animate__delay-1s">
        <Image
          src={logo}
          alt="hoobank"
          width={60}
          height={60}
          loading="eager"
        />
      </div>

      <div className="pt-8">
        <h3 className="text-2xl font-semibold animate__animated animate__fadeInDown animate__delay-1s">
          MockMate is Interviewing you!
        </h3>

        <div
          className={`mt-2 pt-10 ${
            showQuestion ? "animate__animated animate__fadeIn" : "opacity-0"
          }`}
        >
          <h4 className="text-lg font-semibold mb-4 text-blue-400">
            {question_statement}:
          </h4>
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg border-l-4 border-blue-500 animate__animated animate__fadeInUp animate__delay-2s">
            <p className="text-sm leading-relaxed">{question}</p>
          </div>
          {input && expected_output && (
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg mt-4 border-blue-500 animate__animated animate__fadeInUp animate__delay-2s">
              <p className="text-sm leading-relaxed"><span className="text-blue-300 font-semibold"> Input:</span> {input}</p>
              <p className="text-sm leading-relaxed"><span className="text-blue-300 font-semibold"> Expected Output: </span> {expected_output}</p>
            </div>
          )}
          {shouldShowReplay && (
            <button
              className={`mt-6 ${
                isReplayEnabled
                  ? "bg-secondary hover:bg-hoverSecondary hover:scale-105 "
                  : "bg-gray-500"
              } text-onSecondary px-4 py-2 rounded-lg transform transition-all duration-300 flex items-center justify-center ${
                isReplayEnabled
                  ? "animate__animated animate__pulse animate__infinite animate__slow"
                  : "opacity-70 cursor-not-allowed"
              }`}
              onClick={onReplay}
              disabled={!isReplayEnabled}
            >
              <span className="mr-2 text-xl transform scale-x-[-1] ">🕪</span>{" "}
              Replay Audio
            </button>
          )}
        </div>
      </div>

      {/* Fixed button container */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate__animated animate__fadeInUp animate__delay-3s">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-[85%] rounded-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
          onClick={onTerminate}
        >
          <span className="mr-0"></span> Terminate Interview
        </button>
      </div>
    </div>
  );
};

export default Sidebar;