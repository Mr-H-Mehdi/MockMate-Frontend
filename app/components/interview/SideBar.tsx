// components/interview/Sidebar.tsx
import Image from "next/image";
import { logo } from "@/public";

const Sidebar = ({
  question,
  question_statement,
  onTerminate,
  onReplay,
  isReplayEnabled,
  shouldShowReplay, // New prop to control visibility of the replay button
}: {
  question: string;
  question_statement: string;
  onTerminate: () => void;
  onReplay: () => void;
  isReplayEnabled: boolean;
  shouldShowReplay: boolean; // New prop for visibility
}) => {
  // Ensure we display the correct question number (never exceeding total)

  return (
    <div className="w-[32%] bg-gray-800 text-white p-4 h-full relative transition-all duration-500 ease-out animate__animated animate__fadeIn">
      <Image src={logo} alt="hoobank" width={60} height={60} loading="eager" />
      <div className="pt-8 animate__animated animate__slideInLeft animate__delay-1s">
        <h3 className="text-2xl font-semibold">MockMate is Interviewing you!</h3>
        <h4 className="text-lg font-semibold mt-2 pt-16">{question_statement}:</h4>
        <p className="text-sm mt-2">
          {question}
        </p>

        {/* Conditionally render the Replay button */}
        {shouldShowReplay && (
          <button
            className="mt-4 bg-secondary text-primary px-4 py-2 rounded"
            onClick={onReplay}
            disabled={!isReplayEnabled}
          >
            Replay Audio
          </button>
        )}
      </div>

      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 w-[85%] rounded"
        onClick={onTerminate}
      >
        ⏹️ Terminate Interview
      </button>
    </div>
  );
};

export default Sidebar;
