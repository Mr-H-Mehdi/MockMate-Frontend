import { useState, useEffect } from "react";

const MainContent = ({
  interviewData,
  isIntervieweeDisabled,
  shouldAnimate,
  isRecording,
  elapsedTime,
  onStartRecording,
  onDiscardRecording,
  buttonText,
  permissionError,
}: {
  interviewData: any;
  isIntervieweeDisabled: boolean;
  shouldAnimate: boolean;
  isRecording: boolean;
  elapsedTime: number;
  onStartRecording: () => void;
  onDiscardRecording: () => void;
  buttonText: string;
  permissionError: string | null;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [animateVisualizer, setAnimateVisualizer] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      setAnimateVisualizer(true);
    } else {
      // Add delay before stopping animation to make transition smoother
      const timer = setTimeout(() => {
        setAnimateVisualizer(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isIntervieweeDisabled]);

  // Format the elapsed time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 p-8 animate__animated animate__fadeInRight">
      <header className="paddingX flexCenter pt-2"></header>
      <div className="flex-1 grid grid-row gap-6 p-2 text-white">
        {/* Instructions Section */}
        <div className="items-center bg-gray-800 mb-6 p-4 rounded-lg shadow-lg border-l-4 border-red-500 animate__animated animate__fadeInDown animate__delay-1s">
          <p className="text-lg flex items-center">
            <span className="text-red-500 text-2xl mr-2">⁕</span> 
            Please set up in a noise-free environment with a clear microphone.
          </p>
        </div>

        {/* AI Interviewer Section */}
        <div className={`flex flex-col items-center bg-gray-800 justify-center p-16 border border-gray-600 rounded-lg shadow-lg transition-all duration-500 ${isIntervieweeDisabled ? 'bg-gray-700 border-blue-500' : ''} animate__animated animate__fadeIn animate__delay-2s`}>
          <div className={`text-6xl pb-2 ${isIntervieweeDisabled ? 'animate__animated animate__pulse animate__infinite' : ''}`}>🤖</div>
          <p className="text-lg font-semibold mb-4">AI Interviewer</p>
          
          {/* Audio visualization when playing */}
          {animateVisualizer && (
            <div className="mt-4 animate__animated animate__fadeIn">
              <p className="text-green-400 mb-2 text-center">Speaking...</p>
              <div className="flex items-center justify-center space-x-1 h-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                  <div 
                    key={bar}
                    className="bg-blue-500 w-1 rounded-full"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      // FIX: Combine all animation properties into a single shorthand
                      animation: `visualizerAnimation ${0.5 + Math.random() * 0.5}s ease-in-out ${bar * 0.08}s infinite alternate`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Human Interviewee Section */}
        <div
          className={`flex flex-col items-center bg-gray-800 justify-center p-8 border border-gray-600 rounded-lg shadow-lg transition-all duration-300 ${
            isIntervieweeDisabled ? 'opacity-50 pointer-events-none' : isRecording ? 'border-green-500 bg-gray-700' : ''
          } animate__animated animate__fadeIn animate__delay-3s`}
        >
          <p className="text-blue-400 text-3xl font-semibold mb-2 animate__animated animate__fadeIn"> Recording Area </p>
          <p className="text-lg font-semibold pt-4">Record Your Response</p>
          
          {permissionError && (
            <p className="text-red-500 bg-red-100 text-sm p-2 rounded mt-2 animate__animated animate__shakeX">{permissionError}</p>
          )}
          
          <div className="mt-6 flex gap-4 items-center">
            <button
              className={`${
                isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-secondary hover:bg-hoverSecondary text-onSecondary'
              }  font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center ${
                isRecording ? 'animate__animated animate__pulse animate__infinite animate__slow' : ''
              }`}
              onClick={onStartRecording}
              disabled={isButtonDisabled}
            > {buttonText}
            </button>
            
            <div className="text-white px-4 pr-6 q py-2 rounded-full bg-gray-700 font-mono">
              🕒 {elapsedTime ? formatTime(elapsedTime) : "00:00"}
            </div>
            
            <button
              className={`bg-red-500  text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 ${
                !isRecording ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:scale-105'
              } flex items-center`}
              onClick={onDiscardRecording}
              disabled={!isRecording}
            >
              <span className="mr-1">✕</span> Discard Response
            </button>
          </div>
          
          {isRecording && (
            <div className="text-green-400 mt-4 animate__animated animate__fadeIn">
              <div className="flex items-center">
                <span className="mr-2 animate__animated animate__flash animate__infinite">●</span> 
                Recording in progress...
              </div>
              <div className="flex items-center justify-center space-x-1 mt-2 h-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <div 
                    key={bar}
                    className="bg-green-500 w-1 rounded-full"
                    style={{
                      height: `${10 + Math.random() * 20}px`,
                      // FIX: Combine all animation properties into a single shorthand
                      animation: `visualizerAnimation ${0.3 + Math.random() * 0.3}s ease-in-out ${bar * 0.05}s infinite alternate`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;