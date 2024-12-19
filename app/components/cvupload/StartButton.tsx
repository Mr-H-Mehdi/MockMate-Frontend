// components/interview/StartButton.tsx
"use client";
import React from "react";

interface StartButtonProps {
  text: string;
  styles: string;
  onClick: () => void;
  disabled: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ text, styles, onClick, disabled }) => (
  <button
    type="button"
    className={`py-4 px-6 font-poppins font-medium text-[18px] rounded-[10px] outline-none flex justify-end px-9 my-5 ${styles} ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-gradient text-primary'}`}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
);

export default StartButton;
