"use client";
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // If no theme is set, use system preference or default to dark
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
    }
    
    // Apply theme to document
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);
  }, []);

  // Update whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
        isDarkMode 
          ? "bg-gray-800 text-cyan-400 hover:bg-gray-700" 
          : "bg-blue-50 text-cyan-600 hover:bg-blue-100"
      } ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-10 h-6 rounded-full overflow-hidden flex items-center">
        <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-between px-1 ${
          isDarkMode ? "bg-gray-700" : "bg-cyan-100"
        } rounded-full`}>
          <FaMoon className={`transition-opacity duration-300 ${isDarkMode ? "opacity-100" : "opacity-30"}`} size={14} />
          <FaSun className={`transition-opacity duration-300 ${!isDarkMode ? "opacity-100" : "opacity-30"}`} size={14} />
        </div>
        <div 
          className={`absolute w-4 h-4 rounded-full shadow-md transition-all duration-300 transform ${
            isDarkMode 
              ? "translate-x-5 bg-cyan-400" 
              : "translate-x-1 bg-white"
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;