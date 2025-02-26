import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ButtonProps {
  avatarSrc: string; // Non-nullable parameter for avatar image source
  text: string;      // Non-nullable parameter for button text
}

const Button = ({ avatarSrc, text }: ButtonProps) => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ref to track the mobile menu and the button
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Toggle the mobile menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle menu item clicks
  const handleMenuClick = (option: string) => {
    console.log(`${option} clicked`);
    setIsMenuOpen(false); // Close the menu after clicking an option
  };

  // Close the menu if the user clicks outside the button or menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside of the button or menu, close the menu
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener on mount and clean up on unmount
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        ref={buttonRef} // Attach ref to the button
        className="flex items-center justify-between py-1 px-2 bg-blue-500 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none ml-8"
        onClick={toggleMenu} // Toggle menu when button is clicked
      >
        {/* Avatar Image */}
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
          <Image src={avatarSrc} alt="Avatar" width={40} height={40} />
        </div>

        {/* Text */}
        <span className="text-white font-medium">{text}</span>

        {/* Hamburger Menu */}
        <div className="ml-6 w-6 h-6 flex flex-col justify-between items-center">
          <div className="w-full h-[4px] bg-white"></div>
          <div className="w-full h-[4px] bg-white"></div>
          <div className="w-full h-[4px] bg-white"></div>
        </div>
      </button>

      {/* Mobile Menu (toggle visibility based on state) */}
      {isMenuOpen && (
        <div
          ref={menuRef} // Attach ref to the menu
          className="absolute top-16 right-0 bg-gray-800 rounded-lg shadow-lg p-4 w-48 z-50"
        >
          <ul className="list-none">
            <li
              className="text-secondary mb-2 cursor-pointer hover:bg-secondary hover:text-white rounded p-2"
              onClick={() => handleMenuClick("Preferences")}
            >
              Preferences
            </li>
            <li
              className="text-secondary mb-2 cursor-pointer hover:bg-secondary hover:text-white rounded p-2"
              onClick={() => handleMenuClick("Dashboard")}
            >
              Dashboard
            </li>
            <li
              className="text-secondary mb-2 cursor-pointer hover:bg-secondary hover:text-white rounded p-2"
              onClick={() => handleMenuClick("Ranking")}
            >
              Ranking
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Button;
