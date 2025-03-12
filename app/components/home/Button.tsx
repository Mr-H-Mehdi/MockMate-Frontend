'use client';
import React from "react";
import { useRouter } from 'next/navigation';


const Button = ({ 
  styles = "", 
  text = "Let's Go", 
  onClick 
}: { 
  styles?: string; 
  text?: string; 
  onClick?: () => void; 
}) => {
  const navigate = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate.replace("/auth");
    }
  };

  return (
    <button
      type="button"
      className={`py-2 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Button;
