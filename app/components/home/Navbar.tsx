"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navVariants } from "../../styles/animations";
import Image from "next/image";
import { close, logo, menu } from "../../../public";
import { navLinks } from "../../constants";
import Button from './Button';
import { useRouter } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;


const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const navigate = useRouter();
  const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null); // State to hold user data
  const router = useRouter();
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, [router]);

  function login(){
    navigate.replace('/auth')
  }
  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log("No token found to logout.");
        return;
    }

    fetch(`${apiUrl}/api/authenticate/logout`, { // Call backend logout endpoint
        method: "POST",
        headers: {
            "Authorization": token // Send token in Authorization header for logout
        },
    })
        .then(response => {
            if (!response.ok) {
                console.error("Logout failed:", response.statusText); // Log if logout request fails
                // Handle logout error if necessary
            }
            localStorage.removeItem('authToken'); // Remove token from localStorage
            localStorage.removeItem('user'); // Remove user data from localStorage
            console.log("Logout successful.");
            router.replace('/'); // Redirect back to auth page or homepage after logout
        })
        .catch(error => {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again."); // Inform user of logout failure
        });
};

  return (
    <motion.nav
      className="w-full  mx-auto flex py-6 justify-between items-center navbar"
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <Image src={logo} alt="hoobank" width={60} height={60} loading="eager" />
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] hover:text-secondary ${
              active === nav.title ? "text-secondary" : "text-white"
            } ${index === navLinks.length - 1 ? "mr-10" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
        <li>
          {/* <Button text="Login" styles="ml-8 py-1 text-[16px]"></Button> */}
          <Button  onClick={user?handleLogout:login} text={user?"Logout":"Login"} />
          {/* <Button avatarSrc={logo} onClick={user?handleLogout:login} text={user?"Logout":"Login"} /> */}

        </li>
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? close : menu}
          alt="menu"
          width={28}
          height={28}
          priority={true}
          className="object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-50`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-secondary" : "text-white"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            {/* <Button text="Login" styles="m-8 py-1 text-[16px]"></Button> */}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
