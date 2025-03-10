// dashboard/page.tsx

'use client'; // Make sure it's a client component to use hooks
// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/home/Navbar';
import InterviewCard from '../components/dashboard/InterviewCard';
import { FaUserCog, FaPlay, FaHistory } from 'react-icons/fa';
import { Footer } from '../components/home';

interface Interview {
  _id: string;
  interview_role: string;
  total_questions: number;
  interview_score: number;
  skills: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      "_id": "67cdea3035f6854b23c175fc",
      "interview_role": "Junior React Developer",
      "total_questions": 2,
      "interview_score": 0,
      "skills": "React, JS, Node"
    },
    {
      "_id": "67cdea2a35f6854b23c175fa",
      "interview_role": "Junior React Developer",
      "total_questions": 2,
      "interview_score": 0,
      "skills": "React, JS, Node"
    },
    {
      "_id": "67cdea0fce18d2a07f09c8a5",
      "interview_role": "Junior React Developer",
      "total_questions": 2,
      "interview_score": 0,
      "skills": "React, JS, Node"
    },
    {
      "_id": "67cb4fac99faa994a531fe42",
      "interview_role": "aaa",
      "total_questions": 3,
      "interview_score": 60,
      "skills": "aaa"
    },
    {
      "_id": "67cb4f6c99faa994a531fe3e",
      "interview_role": "aaa",
      "total_questions": 3,
      "interview_score": 0,
      "skills": "React"
    },
    {
      "_id": "67cb4c34ec08a09b373e16b9",
      "interview_role": "Junior React Developer",
      "total_questions": 2,
      "interview_score": 0,
      "skills": "React, JS, Node"
    },
    {
      "_id": "67cb437d1536951a5108c082",
      "interview_role": "Junior React Developer",
      "total_questions": 8,
      "interview_score": 0,
      "skills": "React, JS, Node"
    },
    {
      "_id": "67ca19da7b647b7e331a37da",
      "interview_role": "Junior React Developer",
      "total_questions": 2,
      "interview_score": 60,
      "skills": "React, JS, Node"
    }
    // Add other interviews as needed
  ]);

  // For demonstration - uncomment to test the "no interviews" state
  // const [interviews, setInterviews] = useState<Interview[]>([]);

  const handleViewDetails = (id: string) => {
    localStorage.setItem("interview_id", id);
    router.push('/results');
  };

  const hasInterviews = interviews.length > 0;
  const recentInterviews = interviews.slice(0, 4);
  const olderInterviews = interviews.slice(4);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">
            {hasInterviews ? 'Welcome back, John Doe' : 'Welcome, John Doe'}
          </h1>
          <p className="text-gray-400 mt-2">
            {hasInterviews 
              ? 'Your recent interview sessions are displayed below.'
              : 'Start your first interview session to get personalized feedback.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => router.push('/resume-upload')}
            className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <FaPlay className="mr-2" /> Start a New Interview
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-600 font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <FaUserCog className="mr-2" /> Profile Settings
          </button>
        </div>
        
        {/* Interviews or No Interviews Message */}
        {hasInterviews ? (
          <>
            {/* Recent Interviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center">
                <FaHistory className="mr-2" /> Recent Interviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentInterviews.map((interview) => (
                  <InterviewCard 
                    key={interview._id}
                    interview={interview}
                    onViewDetails={handleViewDetails}
                    darkMode={true}
                  />
                ))}
              </div>
            </div>
            
            {/* Older Interviews */}
            {olderInterviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center">
                  <FaHistory className="mr-2" /> Older Interviews
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {olderInterviews.map((interview) => (
                    <InterviewCard 
                      key={interview._id}
                      interview={interview}
                      onViewDetails={handleViewDetails}
                      darkMode={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <svg className="w-24 h-24 text-cyan-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">No previous interviews found</h2>
              <p className="text-gray-400 mb-6">Click the "Start a New Interview" button to begin your first interview session.</p>
              <button 
                onClick={() => router.push('/new-interview')}
                className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <FaPlay className="mr-2" /> Start a New Interview
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}