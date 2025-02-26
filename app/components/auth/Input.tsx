import React from "react";

interface InputProps {
  id: string;
  type: string;
  label: string;
  disabled: boolean;
}

const Input: React.FC<InputProps> = ({ id, type, label, disabled }) => {
  return (
    <input
      className="w-full p-4 mb-4 text-white bg-opacity-25 border border-white rounded-lg focus:outline-none focus:border-white focus:bg-transparent transition-all duration-300"
      type={type}
      id={id}
      placeholder={label}
      disabled={disabled}
    />
  );
};

export default Input;
