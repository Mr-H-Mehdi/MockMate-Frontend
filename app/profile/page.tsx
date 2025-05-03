'use client';

import { useState, useEffect } from 'react';
import CVDropZone from '../components/resume-upload/CVDropZone';
import ProfileForm from '../components/profile/ProfileForm';
import SkillsSection from '../components/profile/SkillsSection';
import ProjectsSection from '../components/profile/ProjectsSection';
import { useRouter } from 'next/navigation';
import Navbar from '../components/home/Navbar';
import { Footer } from '../components/home';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Profile {
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: number;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  contact: {
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  skills: string[];
  projects: Project[];
  resume: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Profile | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const userData = JSON.parse(storedUserStr) as User;
        setUser(userData);
        fetchProfile(userData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.replace("/auth");
      }
    } else {
      router.replace("/auth");
    }
  }, [router]);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setFormData(profileData);
        setSkills(profileData.skills || []);
        setProjects(profileData.projects || []);
      } else if (response.status !== 404) {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (file: File) => {
    // File is handled by CVDropZone component
  };

  const handleFormDataUpdate = (data: any) => {
    setFormData(data);
    // Update skills and projects from the parsed resume data
    if (data.skills) {
      setSkills(Array.isArray(data.skills) ? data.skills : data.skills.split(',').map((s: string) => s.trim()));
    }
    if (data.projects) {
      const projectsList = Array.isArray(data.projects) ? data.projects : data.projects.split(',').map((p: string) => p.trim());
      setProjects(projectsList.map((name: string) => ({
        id: Date.now().toString(),
        name,
        description: 'Project description will be added here'
      })));
    }
  };

  const handleSave = async () => {
    if (!isFormComplete || !user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          skills,
          projects,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {/* User Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyan-400">
              {user ? `Welcome, ${user.name}` : "Welcome"}
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your profile and upload your resume to get started
            </p>
          </div>

          {/* Resume Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Resume Upload</h2>
            <CVDropZone
              onFileDrop={handleFileDrop}
              onFormDataUpdate={handleFormDataUpdate}
            />
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Skills</h2>
            <SkillsSection
              skills={skills}
              onSkillsChange={setSkills}
            />
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Projects</h2>
            <ProjectsSection
              projects={projects}
              onProjectsChange={setProjects}
            />
          </div>

          {/* Profile Form Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Profile Information</h2>
            <ProfileForm
              initialData={formData}
              setFormData={setFormData}
              setIsFormComplete={setIsFormComplete}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isFormComplete}
              className={`px-6 py-3 rounded-lg font-medium shadow-sm transition-colors duration-200 ${
                isFormComplete
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </main>

        <div className="mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
} 