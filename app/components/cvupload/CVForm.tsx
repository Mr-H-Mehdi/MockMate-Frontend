'use client';
// components/CVForm.tsx

import React, { useState, useEffect } from 'react';

const CVForm = ({
  initialData,
  setIsFormComplete,
}: {
  initialData?: any;
  setIsFormComplete: (status: boolean) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    projects: '',
    skills: '',
  });

  // Function to clean up skills (remove non-skill related information)
  const cleanSkills = (skillsData: string | string[]): string => {
    if (Array.isArray(skillsData)) {
      return skillsData.join(', ');
    }
    const splitSkills = skillsData.split('\n').filter(skill => {
      return !skill.toLowerCase().includes('education') && !skill.toLowerCase().includes('university');
    });
    return splitSkills.join(', ');
  };

  // Update the form data when initialData is received (for auto-filling)
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        name: initialData.name !== 'Name not found' ? initialData.name : prevData.name,
        role: initialData.qualification && initialData.qualification !== 'Qualification not found' ? initialData.qualification : prevData.role,
        projects: initialData.projects !== 'Projects not found' ? (Array.isArray(initialData.projects) ? initialData.projects.join(', ') : initialData.projects) : prevData.projects,
        skills: initialData.skills !== 'Skills not found' ? cleanSkills(initialData.skills) : prevData.skills,
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };
      // Check if form is complete and update the parent state
      setIsFormComplete(
        updatedData.name !== '' &&
        updatedData.role !== '' &&
        updatedData.projects !== '' &&
        updatedData.skills !== ''
      );
      return updatedData;
    });
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

        {/* Education Field */}
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
      </div>
    </form>
  );
};

export default CVForm;
