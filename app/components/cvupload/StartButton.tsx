// components/interview/StartButton.tsx
"use client";
import React from "react";

// Define types for the props
interface StartButtonProps {
  text: string;
  styles: string;
  onClick: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ text, styles, onClick }) => (
  <button
    type="button"
    className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none flex justify-end px-9 my-5 ${styles}`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default StartButton;
