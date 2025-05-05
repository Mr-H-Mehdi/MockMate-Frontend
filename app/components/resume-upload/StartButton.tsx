"use client";
import React from "react";

interface StartButtonProps {
  text: string;
  styles: string;
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ 
  text, 
  styles, 
  onClick, 
  disabled,
  loading = false
}) => (
  <button
    type="button"
    className={`py-4 px-6 font-poppins font-medium text-[18px] rounded-[10px] outline-none flex items-center justify-center ${styles} ${
      disabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-gradient text-primary'
    }`}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </>
    ) : (
      text
    )}
  </button>
);

export default StartButton;