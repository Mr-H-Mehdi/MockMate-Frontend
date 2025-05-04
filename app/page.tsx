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

export default function Home() {
  const { theme } = useTheme();

  return (
    <main
      className={`${
        theme === "dark" ? "bg-primary dark text-gray-300" : "bg-light-primary light"
      } w-full overflow-hidden font-poppins theme-transition`}
    >
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>

      <section
        className={`${
          theme === "dark" ? "bg-primary" : "bg-light-primary"
        } flexStart theme-transition`}
      >
        <section className="boxWidth">
          <Hero />
        </section>
      </section>

      <section
        className={`${
          theme === "dark" ? "bg-primary" : "bg-light-primary"
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
