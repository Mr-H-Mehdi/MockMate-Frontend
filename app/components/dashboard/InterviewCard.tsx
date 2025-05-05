// components/InterviewCard.tsx
import React from 'react';
import { useTheme } from '../home/ThemeContext';

interface Interview {
  _id: string;
  interview_role: string;
  total_questions: number;
  interview_score: number;
  skills: string;
}

interface InterviewCardProps {
  interview: Interview;
  onViewDetails: (id: string) => void;
  theme?: string;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onViewDetails, theme = "dark" }) => {
  const { _id, interview_role, total_questions, interview_score, skills } = interview;
  
  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return { ring: 'text-green-500', bg: 'bg-green-100', text: 'text-green-800', darkBg: 'bg-green-900', darkText: 'text-green-400' };
    if (score >= 40) return { ring: 'text-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'bg-yellow-900', darkText: 'text-yellow-400' };
    return { ring: 'text-red-500', bg: 'bg-red-100', text: 'text-red-800', darkBg: 'bg-red-900', darkText: 'text-red-400' };
  };
  
  const scoreColor = getScoreColor(interview_score);
  
  // Calculate progress for the ring
  const circumference = 2 * Math.PI * 24; // 2πr where r=24 (radius)
  const strokeDashoffset = circumference - (interview_score / 100) * circumference;
  // const { theme } = useTheme();
  
  return (
    <div className={`${theme==="dark" ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-xl font-bold ${theme==="dark" ? 'text-cyan-400' : 'text-cyan-800'} truncate`}>
            {interview_role}
          </h3>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="24"
                fill="none"
                stroke={theme==="dark" ? "#374151" : "#e5e7eb"}
                strokeWidth="3"
              />
              <circle
                cx="25"
                cy="25"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={scoreColor.ring}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {interview_score}%
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className={`text-sm font-medium ${theme==="dark" ? 'text-gray-400' : 'text-gray-500'}`}>Questions:</span>
            <span className={`ml-2 text-sm font-bold ${theme==="dark" ? 'text-cyan-400' : 'text-cyan-700'}`}>{total_questions}</span>
          </div>
          
          <div>
            <span className={`text-sm font-medium ${theme==="dark" ? 'text-gray-400' : 'text-gray-500'}`}>Skills:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {skills.split(',').map((skill, index) => (
                <span key={index} className={`px-2 py-1 ${theme==="dark" ? 'bg-cyan-900 text-cyan-400' : 'bg-cyan-100 text-cyan-700'} rounded-full text-xs`}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onViewDetails(_id)}
          className={`w-full py-2 px-4 ${theme==="dark" ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Show Detailed Feedback
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;