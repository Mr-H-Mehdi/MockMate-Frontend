"use client";
import { useTheme } from "./components/home/ThemeContext";
import {
  Navbar,
  Hero,
  Stats,
  Billing,
  Business,
  CardDeal,
  Testimonials,
  Clients,
  CTA,
  Footer,
} from "./components/home";
import { useEffect } from "react";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_BASE_URL;

export default function Home() {
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Response from Backend API:", response);

        const mlresponse = await fetch(`${mlApiUrl}/`, {
          method: "GET",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log("Response from ML API:", mlresponse);

        // You can handle response here if needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main
      className={`${theme === "dark" ? "bg-primary dark text-gray-300" : "bg-light-primary light"
        } w-full overflow-hidden font-poppins theme-transition`}
    >
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>

      <section
        className={`${theme === "dark" ? "bg-primary" : "bg-light-primary"
          } flexStart theme-transition`}
      >
        <section className="boxWidth">
          <Hero />
        </section>
      </section>

      <section
        className={`${theme === "dark" ? "bg-primary" : "bg-light-primary"
          } paddingX flexStart theme-transition`}
      >
        <section className="boxWidth">
          <Stats />
          <Business />
          <Billing />
          <CardDeal />
          <Testimonials />
          <Clients />
          <CTA />
          <Footer />
        </section>
      </section>
    </main>
  );
}
