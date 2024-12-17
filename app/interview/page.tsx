"use client";
import { useEffect, useState, useRef } from "react";
import AudioPlayer from "react-audio-player";
import VisualizerOne from "../components/interview/VisualizerOne";
import VisualizerTwo from "../components/interview/VisualizerTwo";

import "../wavestyle.css"; // Import the custom CSS file for wave animation
import { Navbar } from "../components";

const Home = () => {
  return (
    <main className="h-screen items-center bg-primary w-full font-poppins justify-center">
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>

      <section className="bg-primary border-inbetween paddingX items-center py-12 flex md:flex-row flex-col paddingY">
        
        {/* VisualizerOne with a border */}
        <div className="border border-secondary p-4 flex-1 items-center">
          <VisualizerOne />
        </div>

        {/* VisualizerTwo with a border */}
        <div className=" border border-secondary p-4 flex-1">
          <VisualizerTwo />
        </div>
      </section>
    </main>
  );
};

export default Home;
