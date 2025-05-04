"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navVariants } from "../../styles/animations";
import Image from "next/image";
import { close, logo, menu } from "../../../public";
import { navLinks } from "../../constants";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./ThemeContext"; // ✅ import context

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const router = useRouter();

  const { theme, toggleTheme } = useTheme(); // ✅ use context
  const isDarkMode = theme === "dark"; // ✅ derived from context

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const login = () => router.replace("/auth");

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return router.replace("/");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/authenticate/logout`,
        {
          method: "POST",
          headers: { Authorization: token },
        }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      router.replace("/");
      window.location.reload(); // optional
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <motion.nav
      className={`w-full mx-auto flex py-6 justify-between items-center navbar ${
        !isDarkMode ? "bg-light-primary" : ""
      }`}
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className={`${!isDarkMode ? "bg-black p-[3px] rounded-md inline-block" : "bg-gray-700 p-[3px] rounded-md inline-block"}`}>
        <Image
          src={logo}
          alt="hoobank"
          width={60}
          height={60}
          loading="eager"
        />
      </div>{" "}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] hover:text-secondary ${
              active === nav.id
                ? "text-secondary"
                : isDarkMode
                ? "text-white"
                : "text-primary"
            } ${index === navLinks.length - 1 ? "mr-10" : "mr-10"}`}
            onClick={() => {
              setActive(nav.id);
              router.push(`/${nav.id}`);
            }}
          >
            {nav.title}
          </li>
        ))}

        <li className="mr-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              isDarkMode
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <SunIcon
                size={20}
                className="transition-transform hover:rotate-45"
              />
            ) : (
              <MoonIcon
                size={20}
                className="transition-transform hover:scale-110"
              />
            )}
          </button>
        </li>

        <li>
          <Button
            onClick={user ? handleLogout : login}
            text={user ? "Logout" : "Login"}
          />
        </li>
      </ul>
      {/* Mobile nav */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <button
          onClick={toggleTheme}
          className={`p-2 mr-4 rounded-full flex items-center justify-center transition-all ${
            isDarkMode
              ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          {isDarkMode ? (
            <SunIcon
              size={20}
              className="transition-transform hover:rotate-45"
            />
          ) : (
            <MoonIcon
              size={20}
              className="transition-transform hover:scale-110"
            />
          )}
        </button>

        <Image
          src={toggle ? close : menu}
          alt="menu"
          width={28}
          height={28}
          priority
          className="object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"} p-6 ${
            isDarkMode ? "bg-black-gradient" : "bg-white shadow-lg"
          } absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-50`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title
                    ? "text-secondary"
                    : isDarkMode
                    ? "text-white"
                    : "text-primary"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => router.push(`/${nav.id}`)}
              >
                {nav.title}
              </li>
            ))}
            <li className="mt-4">
              <Button
                onClick={user ? handleLogout : login}
                text={user ? "Logout" : "Login"}
              />
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
