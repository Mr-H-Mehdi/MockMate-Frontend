'use client';

import { useState, useEffect } from 'react';

interface ProfileFormProps {
  initialData?: any;
  setFormData: (data: any) => void;
  setIsFormComplete: (status: boolean) => void;
}

export default function ProfileForm({
  initialData,
  setFormData,
  setIsFormComplete,
}: ProfileFormProps) {
  const [localFormData, setLocalFormData] = useState({
    education: {
      degree: '',
      field: '',
      institution: '',
      graduationYear: new Date().getFullYear(),
    },
    experience: [{
      title: '',
      company: '',
      duration: '',
      description: '',
    }],
    contact: {
      phone: '',
      location: '',
      linkedin: '',
      github: '',
    }
  });

  // Process initial data when it becomes available
  useEffect(() => {
    if (initialData) {
      const processedData = {
        education: {
          degree: initialData.education?.degree || '',
          field: initialData.education?.field || '',
          institution: initialData.education?.institution || '',
          graduationYear: initialData.education?.graduationYear || new Date().getFullYear(),
        },
        experience: initialData.experience?.length > 0 
          ? initialData.experience 
          : [{
              title: '',
              company: '',
              duration: '',
              description: '',
            }],
        contact: {
          phone: initialData.contact?.phone || '',
          location: initialData.contact?.location || '',
          linkedin: initialData.contact?.linkedin || '',
          github: initialData.contact?.github || '',
        }
      };

      setLocalFormData(processedData);
      setFormData(processedData);
    }
  }, [initialData, setFormData]);

  // Check form completeness
  useEffect(() => {
    const isComplete =
      localFormData.education.degree !== '' &&
      localFormData.education.institution !== '' &&
      localFormData.experience[0].title !== '' &&
      localFormData.experience[0].company !== '';

    setIsFormComplete(isComplete);
  }, [localFormData, setIsFormComplete]);

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...localFormData,
      education: {
        ...localFormData.education,
        [name]: name === 'graduationYear' ? parseInt(value) || new Date().getFullYear() : value,
      }
    };
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperience = [...localFormData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [name]: value,
    };

    const updatedData = {
      ...localFormData,
      experience: updatedExperience,
    };
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  const addExperience = () => {
    const updatedData = {
      ...localFormData,
      experience: [
        ...localFormData.experience,
        {
          title: '',
          company: '',
          duration: '',
          description: '',
        }
      ]
    };
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = localFormData.experience.filter((_, i) => i !== index);
    const updatedData = {
      ...localFormData,
      experience: updatedExperience,
    };
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...localFormData,
      contact: {
        ...localFormData.contact,
        [name]: value,
      }
    };
    setLocalFormData(updatedData);
    setFormData(updatedData);
  };

  return (
    <form className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      {/* Education Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="degree" className="block text-white font-medium mb-2">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={localFormData.education.degree}
              onChange={handleEducationChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="e.g., Bachelor of Science"
            />
          </div>
          <div>
            <label htmlFor="field" className="block text-white font-medium mb-2">
              Field of Study
            </label>
            <input
              type="text"
              id="field"
              name="field"
              value={localFormData.education.field}
              onChange={handleEducationChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <label htmlFor="institution" className="block text-white font-medium mb-2">
              Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={localFormData.education.institution}
              onChange={handleEducationChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="e.g., University of Technology"
            />
          </div>
          <div>
            <label htmlFor="graduationYear" className="block text-white font-medium mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={localFormData.education.graduationYear}
              onChange={handleEducationChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="e.g., 2024"
            />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-cyan-400">Work Experience</h3>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
          >
            Add Experience
          </button>
        </div>
        {localFormData.experience.map((exp, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-cyan-400">Experience {index + 1}</h4>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`title-${index}`} className="block text-white font-medium mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 bg-gray-600 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <label htmlFor={`company-${index}`} className="block text-white font-medium mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`company-${index}`}
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 bg-gray-600 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., Tech Corp"
                />
              </div>
              <div>
                <label htmlFor={`duration-${index}`} className="block text-white font-medium mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id={`duration-${index}`}
                  name="duration"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 bg-gray-600 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>
              <div>
                <label htmlFor={`description-${index}`} className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, e)}
                  rows={3}
                  className="w-full p-3 bg-gray-600 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-white font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={localFormData.contact.phone}
              onChange={handleContactChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-white font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={localFormData.contact.location}
              onChange={handleContactChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="Enter your location"
            />
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-white font-medium mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={localFormData.contact.linkedin}
              onChange={handleContactChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="Enter your LinkedIn URL"
            />
          </div>
          <div>
            <label htmlFor="github" className="block text-white font-medium mb-2">
              GitHub Profile
            </label>
            <input
              type="url"
              id="github"
              name="github"
              value={localFormData.contact.github}
              onChange={handleContactChange}
              className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="Enter your GitHub URL"
            />
          </div>
        </div>
      </div>
    </form>
  );
} 