'use client';
// components/CVForm.tsx

import React, { useState } from 'react';

const CVForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    projects: '',
    skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg py-3 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-white font-medium mb-2">
            Name
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
            Education
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
            Projects
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
            Skills
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

      {/* Submit Button */}
      {/* <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div> */}
    </form>
  );
};

export default CVForm;
