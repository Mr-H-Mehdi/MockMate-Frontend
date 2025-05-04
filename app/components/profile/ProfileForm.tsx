'use client';

import { useState, useEffect } from 'react';

interface ProfileFormProps {
  initialData?: any;
  setFormData: (data: any) => void;
  setIsFormComplete: (status: boolean) => void;
  userName: string;
  onUsernameUpdate: (newUsername: string) => Promise<void>;
}

export default function ProfileForm({
  initialData,
  setFormData,
  setIsFormComplete,
  userName,
  onUsernameUpdate,
}: ProfileFormProps) {
  const [localFormData, setLocalFormData] = useState({
    username: userName,
    education: {
      degree: '',
      field: '',
      institution: '',
      graduationYear: new Date().getFullYear(),
    }
  });
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Process initial data when it becomes available
  useEffect(() => {
    if (initialData && !localFormData.education.degree) {
      const processedData = {
        username: userName,
        education: {
          degree: initialData.education?.degree || '',
          field: initialData.education?.field || '',
          institution: initialData.education?.institution || '',
          graduationYear: initialData.education?.graduationYear || new Date().getFullYear(),
        }
      };

      setLocalFormData(processedData);
      setFormData(processedData);
    }
  }, [initialData, userName]);

  // Update username when userName prop changes
  useEffect(() => {
    setLocalFormData(prev => ({
      ...prev,
      username: userName
    }));
  }, [userName]);

  // Check form completeness
  useEffect(() => {
    const isComplete =
      localFormData.username !== '' &&
      localFormData.education.degree !== '';

    setIsFormComplete(isComplete);
  }, [localFormData, setIsFormComplete]);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setLocalFormData(prev => ({
      ...prev,
      username: newUsername
    }));
    setUsernameError('');
  };

  const handleUsernameBlur = async () => {
    if (localFormData.username === userName) return;
    
    if (localFormData.username.trim() === '') {
      setUsernameError('Username cannot be empty');
      setLocalFormData(prev => ({
        ...prev,
        username: userName
      }));
      return;
    }

    setIsUpdatingUsername(true);
    try {
      await onUsernameUpdate(localFormData.username);
    } catch (error) {
      setUsernameError('Failed to update username');
      setLocalFormData(prev => ({
        ...prev,
        username: userName
      }));
    } finally {
      setIsUpdatingUsername(false);
    }
  };

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

  return (
    <form className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-white font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={localFormData.username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                disabled={isUpdatingUsername}
                className={`w-full p-3 bg-gray-700 text-white border-2 ${
                  usernameError ? 'border-red-500' : 'border-gray-500'
                } rounded-md focus:outline-none focus:border-cyan-500 ${
                  isUpdatingUsername ? 'opacity-75' : ''
                }`}
                placeholder="Enter your username"
              />
              {isUpdatingUsername && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                </div>
              )}
            </div>
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
          </div>
        </div>
      </div>

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
              placeholder="e.g., Bachelor of Engineering"
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
              placeholder="e.g., Software Engineering"
            />
          </div>
          <div>
            <label htmlFor="institution" className="block text-white font-medium mb-2">
              Institution
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
    </form>
  );
} 