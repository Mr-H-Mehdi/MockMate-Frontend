'use client';
import React from "react";
import Input from "./Input";

interface LoginFormProps {
  mode: "login" | "signup";
  onSubmit: (event: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ mode, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={`space-y-4 ${mode === 'signup' ? 'block' : 'hidden'}`}>
        <Input type="text" id="fullname" label="Full Name" disabled={mode === 'login'} />
        <Input type="email" id="email" label="Email" disabled={mode === 'login'} />
        <Input type="password" id="createpassword" label="Password" disabled={mode === 'login'} />
        <Input type="password" id="repeatpassword" label="Repeat Password" disabled={mode === 'login'} />
      </div>
      <div className={`space-y-4 ${mode === 'login' ? 'block' : 'hidden'}`}>
        <Input type="text" id="username" label="Username" disabled={mode === 'signup'} />
        <Input type="password" id="password" label="Password" disabled={mode === 'signup'} />
      </div>
      <button
        type="submit"
        className="w-full p-4 text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 focus:outline-none transition-all duration-300"
      >
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
};

export default LoginForm;
