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
    const wakeupServers = () => {
      // Make both requests simultaneously without waiting for each other
      const wakeBackend = fetch(`${apiUrl}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("Backend API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking backend:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeBackend, 300);
        });

      const wakeML = fetch(`${mlApiUrl}/`, {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          console.log("ML API status:", response.status);
          return response;
        })
        .catch(error => {
          console.log("Error waking ML service:", error);
          // Retry after a short delay if the request fails
          setTimeout(() => wakeML, 300);
        });

      // You can use Promise.all to wait for both if needed
      Promise.all([wakeBackend, wakeML])
        .then(() => console.log("Both services are awake"))
        .catch(error => console.log("Error waking services:", error));
    };

    // Initial wake-up call
    wakeupServers();

    // Optional: Set up a periodic ping to keep the services awake
    // This will ping both servers every 14 minutes to prevent them from going idle
    const keepAliveInterval = setInterval(wakeupServers, 14 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(keepAliveInterval);
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
