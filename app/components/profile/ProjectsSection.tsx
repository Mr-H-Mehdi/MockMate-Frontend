'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

export default function ProjectsSection({ projects, onProjectsChange }: ProjectsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const handleAddProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      onProjectsChange([
        ...projects,
        {
          id: Date.now().toString(),
          name: newProject.name.trim(),
          description: newProject.description.trim(),
        },
      ]);
      setNewProject({ name: '', description: '' });
    }
  };

  const handleRemoveProject = (projectId: string) => {
    onProjectsChange(projects.filter(project => project.id !== projectId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProject();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium text-white">Projects</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-cyan-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-cyan-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 space-y-4">
          {/* Add Project Form */}
          <div className="space-y-4">
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Project Name"
              className="w-full p-2 bg-gray-700 text-white border-2 border-gray-600 rounded-md focus:outline-none focus:border-cyan-500"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project Description"
              rows={3}
              className="w-full p-2 bg-gray-700 text-white border-2 border-gray-600 rounded-md focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAddProject}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Project
            </button>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={`project-${project.id}`}
                className="bg-gray-700 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">{project.name}</h4>
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-300">{project.description}</p>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              No projects added yet. Add your projects to showcase your work.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 