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
  const [formData, setFormDataState] = useState({
    name: '',
    role: '',
    projects: '',
    skills: '',
  });

  const cleanSkills = (skillsData: string | string[]): string => {
    if (Array.isArray(skillsData)) {
      return skillsData.join(', ');
    }
    const splitSkills = skillsData.split('\n').filter(skill => {
      return !skill.toLowerCase().includes('education') && !skill.toLowerCase().includes('university');
    });
    return splitSkills.join(', ');
  };

  useEffect(() => {
    if (initialData) {
      setFormDataState(prevData => ({
        name: initialData.name !== 'Name not found' ? initialData.name : prevData.name,
        role: initialData.qualification && initialData.qualification !== 'Qualification not found' ? initialData.qualification : prevData.role,
        projects: initialData.projects !== 'Projects not found' ? (Array.isArray(initialData.projects) ? initialData.projects.join(', ') : initialData.projects) : prevData.projects,
        skills: initialData.skills !== 'Skills not found' ? cleanSkills(initialData.skills) : prevData.skills,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    setIsFormComplete(
      formData.name !== '' &&
      formData.role !== '' &&
      formData.projects !== '' &&
      formData.skills !== ''
    );
  }, [formData, setIsFormComplete]);

  useEffect(() => {
    if (formData) {
      setFormData((prevState: { name: string; role: string; projects: string; skills: string; }) => {
        if (
          prevState?.name !== formData.name ||
          prevState?.role !== formData.role ||
          prevState?.projects !== formData.projects ||
          prevState?.skills !== formData.skills
        ) {
          return formData;
        }
        return prevState;
      });
    }
  }, [formData, setFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataState(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalQuestions(Number(e.target.value)); // Update the totalQuestions state
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
            value={formData.name}
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
            value={formData.role}
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
            value={formData.projects}
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
            value={formData.skills}
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
