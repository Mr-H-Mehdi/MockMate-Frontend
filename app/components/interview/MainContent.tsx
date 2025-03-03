import { useState, useEffect } from "react";

const MainContent = ({
  interviewData,
  isIntervieweeDisabled,
  isRecording,
  elapsedTime,
  onStartRecording,
  onDiscardRecording,
  buttonText,
  permissionError,
}: {
  interviewData: any;
  isIntervieweeDisabled: boolean;
  isRecording: boolean;
  elapsedTime: number;
  onStartRecording: () => void;
  onDiscardRecording: () => void;
  buttonText: string;
  permissionError: string | null;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Format the elapsed time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 p-8 animate__animated animate__fadeIn animate__delay-2s">
      <header className="paddingX flexCenter pt-2"></header>
      <div className="flex-1 grid grid-row gap-6 p-2 text-white">
        {/* Instructions Section */}
        <div className="items-center bg-gray-800 mb-6 p-2 rounded-lg">
          <p className="text-lg">
            <span className="text-red-500 text-2xl">⁕</span> Please set up in a
            noise-free environment with a clear microphone.
          </p>
        </div>

        {/* AI Interviewer Section */}
        <div className="flex flex-col items-center bg-gray-800 justify-center p-20 border border-gray-600 rounded-lg">
          <div className="text-6xl pb-2">🤖</div>
          <p className="text-lg font-semibold">AI Interviewer</p>
        </div>

        {/* Human Interviewee Section */}
        <div
          className={`flex flex-col items-center bg-gray-800 justify-center p-6 border border-gray-600 rounded-lg ${
            isIntervieweeDisabled ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <p className="text-blue text-3xl font-semibold"> Recording Area </p>
          <p className="text-lg font-semibold pt-8">Record Your Response</p>
          {permissionError && <p className="text-red-500">{permissionError}</p>}
          <div className="mt-4 flex gap-4">
            <button
              className={`${isRecording ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold px-4 py-2 rounded-full transition-colors`}
              onClick={onStartRecording}
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
            <p className="text-white px-4 py-2 rounded-md">
              🕒 {elapsedTime ? formatTime(elapsedTime) : "00:00"}
            </p>
            <button
              className={`bg-red-500 text-white font-semibold px-4 py-2 rounded-full ${!isRecording ? 'opacity-50' : ''}`}
              onClick={onDiscardRecording}
              disabled={!isRecording}
            >
              X Discard Response
            </button>
          </div>
          {isRecording && (
            <p className="text-green-400 mt-4">Recording in progress...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;