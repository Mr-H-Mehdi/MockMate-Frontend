'use client';

import React, { useState, useEffect } from 'react';

const CVForm = ({
  initialData,
  setFormData,
  setIsFormComplete,
  totalQuestions,
  setTotalQuestions,
}: {
  initialData?: any;
  setFormData: (data: any) => void;
  setIsFormComplete: (status: boolean) => void;
  totalQuestions: number;
  setTotalQuestions: (value: number) => void;
}) => {
  const [localFormData, setLocalFormData] = useState({
    name: '',
    role: '',
    projects: '',
    skills: '',
  });
  
  // Flag to track if initialData has been processed
  const [initialDataProcessed, setInitialDataProcessed] = useState(false);

  const cleanSkills = (skillsData: string | string[]): string => {
    if (Array.isArray(skillsData)) {
      return skillsData.join(', ');
    }
    const splitSkills = skillsData.split('\n').filter(skill => {
      return !skill.toLowerCase().includes('education') && !skill.toLowerCase().includes('university');
    });
    return splitSkills.join(', ');
  };

  // Only process initialData once when it becomes available
  useEffect(() => {
    if (initialData && !initialDataProcessed) {
      const processedData = {
        name: initialData.name !== 'Name not found' ? initialData.name : '',
        role: initialData.qualification && initialData.qualification !== 'Qualification not found' ? initialData.qualification : '',
        projects: initialData.projects !== 'Projects not found' ? (Array.isArray(initialData.projects) ? initialData.projects.join(', ') : initialData.projects) : '',
        skills: initialData.skills !== 'Skills not found' ? cleanSkills(initialData.skills) : '',
      };
      
      setLocalFormData(processedData);
      setFormData(processedData);
      setInitialDataProcessed(true);
    }
  }, [initialData, initialDataProcessed, setFormData]);

  // Check form completeness when local data changes
  useEffect(() => {
    const isComplete = 
      localFormData.name !== '' &&
      localFormData.role !== '' &&
      localFormData.projects !== '' &&
      localFormData.skills !== '';
    
    setIsFormComplete(isComplete);
  }, [localFormData, setIsFormComplete]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...localFormData,
      [name]: value
    };
    
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalQuestions(Number(e.target.value));
  };

  return (
    <form className="bg-gray-800 p-6 rounded-lg shadow-lg py-3 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-white font-medium mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={localFormData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-white font-medium mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={localFormData.role}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your role"
          />
        </div>

        {/* Projects Field */}
        <div>
          <label htmlFor="projects" className="block text-white font-medium mb-2">
            Projects <span className="text-red-500">*</span>
          </label>
          <textarea
            id="projects"
            name="projects"
            value={localFormData.projects}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your projects"
          />
        </div>

        {/* Skills Field */}
        <div>
          <label htmlFor="skills" className="block text-white font-medium mb-2">
            Skills <span className="text-red-500">*</span>
          </label>
          <textarea
            id="skills"
            name="skills"
            value={localFormData.skills}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your skills"
          />
        </div>

        {/* Total Questions Dropdown */}
        <div className='flex '>
          <label htmlFor="total_questions" className="w-1/3 pt-2.5 grow-1 block text-white font-medium mb-2 relative ">
            Total Questions <span className="text-red-500">:</span>
          </label>
          <select
            id="total_questions"
            name="total_questions"
            value={totalQuestions}
            onChange={handleQuestionChange}
            className="w-full grow-1 p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default CVForm;