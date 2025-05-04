import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        primary: "#00040f",
        onPrimary: "rgb(0, 176, 176)",
        onPrimary2: "rgb(0, 142, 142)",
        secondary: "#00f6ff",
        hoverSecondary: "rgb(0, 147, 192)",
        onSecondary: "rgb(22, 66, 79)",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",

        // Light mode colors
        light: {
          primary: "#f8fafc",
          secondary: "#0284c7",
          text: "#1e293b",
          dimText: "rgba(30, 41, 59, 0.7)",
          background: "#ffffff",
          accent: "#0ea5e9",
        },
        darkBackground: "#1f2937",
        lightBackground: "#f1f7f5",
        lightBlue: "#cce4f6",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundColor: {
        "theme-primary": "var(--bg-primary)",
      },
      textColor: {
        "theme-primary": "var(--text-primary)",
        "theme-secondary": "var(--text-secondary)",
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
  // Add variant for light mode
  variants: {
    extend: {
      backgroundColor: ["dark", "light"],
      textColor: ["dark", "light"],
      borderColor: ["dark", "light"],
    },
  },
};
export default config;
