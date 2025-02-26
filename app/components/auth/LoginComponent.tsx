'use client';
import React, { useState } from "react";
import LoginForm from "./LoginForm";

const LoginComponent: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Function to toggle between login and signup
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Submitted");
  };

  return (
    <div>
      <div
        className={`fixed top-0 left-0 right-0 h-full transition-all duration-850 ease-in-out ${
          mode === "login" ? "bg-blue-800 opacity-90" : "bg-indigo-800 opacity-95"
        }`}
      ></div>
      <section className="relative mt-24 w-80 mx-auto p-6 bg-opacity-50 bg-white rounded-lg shadow-lg">
        <header className="mb-6 text-center text-white">
          <h1 className="text-3xl">{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
          <div className="mt-4 text-sm text-gray-400">
            <span>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <input
              id="form-toggler"
              type="checkbox"
              onClick={toggleMode}
              className="hidden"
            />
            <label
              htmlFor="form-toggler"
              className="cursor-pointer text-yellow-500 font-semibold"
            >
              Click here &rarr;
            </label>
          </div>
        </header>
        <LoginForm mode={mode} onSubmit={handleSubmit} />
      </section>
    </div>
  );
};

export default LoginComponent;
