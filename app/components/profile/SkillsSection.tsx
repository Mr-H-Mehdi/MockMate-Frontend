'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillsSection({ skills, onSkillsChange }: SkillsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium text-white">Skills</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-cyan-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-cyan-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 space-y-4">
          {/* Add Skill Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new skill"
              className="flex-1 p-2 bg-gray-700 text-white border-2 border-gray-600 rounded-md focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add
            </button>
          </div>

          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="group flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-full"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              No skills added yet. Add your skills to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 