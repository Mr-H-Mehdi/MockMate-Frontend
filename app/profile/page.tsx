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
  userId: string;
  username: string;
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: number;
  };
  skills: string[];
  projects: Project[];
  resume: string | null;
  updatedAt: Date;
}

type SettingsTab = 'general' | 'password';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Profile | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

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
          'Authorization': `${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setFormData(profileData);
        setSkills(profileData.skills || []);
        
        // Transform projects to include id from _id
        const transformedProjects = (profileData.projects || []).map((project: any) => ({
          id: project._id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: project.name || '',
          description: project.description || 'Project description will be added here'
        }));
        setProjects(transformedProjects);
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
    if (data.status === 'success' && data.data) {
      const parsedData = data.data;
      
      // Parse qualification into education data
      let degree = '';
      let field = '';
      if (parsedData.qualification) {
        const parts = parsedData.qualification.split(' in ');
        if (parts.length === 2) {
          degree = parts[0].trim();
          field = parts[1].trim();
        } else {
          // If there's no "in" separator, use the whole qualification as degree
          degree = parsedData.qualification.trim();
        }
      }

      // Update education data
      const educationData = {
        degree: degree,
        field: field,
        institution: '', // This will need to be filled manually
        graduationYear: new Date().getFullYear(), // This will need to be filled manually
      };

      // Update skills
      const skillsList = parsedData.skills
        ? parsedData.skills.split(',').map((skill: string) => skill.trim())
        : [];
      setSkills(skillsList);
      console.log(parsedData.projects);
      // Update projects with unique IDs
      const projectsList = parsedData.projects
        ? parsedData.projects.split(',').map((name: string, index: number) => ({
            id: `project-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            description: 'Project description will be added here'
          }))
        : [];
      setProjects(projectsList);

      // Update form data while maintaining the Profile type structure
      const updatedFormData: Profile = {
        userId: formData?.userId || '',
        username: formData?.username || '',
        education: educationData,
        skills: skillsList,
        projects: projectsList,
        resume: formData?.resume || null,
        updatedAt: new Date()
      };
      setFormData(updatedFormData);
    }
  };

  const handleSave = async () => {
    if (!isFormComplete || !user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          education: formData?.education,
          skills,
          projects,
          resume: formData?.resume
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

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordError('');
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please check your current password.');
    }
  };

  const handleUsernameUpdate = async (newUsername: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          name: newUsername
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update username');
      }

      // Update local user data
      if (user) {
        const updatedUser: User = {
          id: user.id,
          name: newUsername,
          email: user.email
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
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
              {user ? `Welcome, ${user.email}` : "Welcome"}
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your profile and settings
            </p>
          </div>

          {/* Settings Navigation */}
          <div className="mb-8">
            <div className="flex space-x-4 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'general'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                General Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'password'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                Change Password
              </button>
            </div>
          </div>

          {activeTab === 'general' ? (
            <>
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
                  userName={user?.name || ''}
                  onUsernameUpdate={handleUsernameUpdate}
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
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Change Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-white font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-white font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full p-3 bg-gray-700 text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}

                  <button
                    onClick={handlePasswordChange}
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
} 