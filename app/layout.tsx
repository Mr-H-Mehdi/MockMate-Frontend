import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css";
import { ThemeProvider } from "./components/home/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
});

export const metadata: Metadata = {
  title: "MockMate",
  description: "The Next Generation Interview Prep",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
              <ThemeProvider>

      <body className={`${poppins.variable} font-serif`}>{children}</body>
              </ThemeProvider>
    </html>
  );
}
