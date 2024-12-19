// components/VisualizerOne.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "../../styles/animations";
import { intr1 } from "@/public";

const VisualizerOne = () => {
  const [isAudioPlayed, setIsAudioPlayed] = useState(false); // Tracks if the audio has been played
  const [waves, setWaves] = useState<any[]>([]); // Stores the waves that will be rendered
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // Audio element reference

  const handlePlayAudio = () => {
    const newAudio = new Audio("/file.mp3");
    newAudio
      .play()
      .then(() => {
        setIsAudioPlayed(true);
        setAudio(newAudio); // Set audio reference for later use
      })
      .catch((error) => {
        console.log("Audio playback error:", error);
      });
  };

  useEffect(() => {
    if (audio) {
      const interval = setInterval(() => {
        if (!audio.paused && !audio.ended) {
          setWaves((prevWaves) => [...prevWaves, Date.now()]); // Add new wave every second
        }
      }, 1000);

      // Clean up interval when audio ends or component unmounts
      audio.onended = () => {
        clearInterval(interval);
        setWaves([]); // Clear waves once audio ends
      };

      return () => {
        clearInterval(interval); // Clean up when component unmounts
      };
    }
  }, [audio]);

  return (
    <motion.div
      className="flex-1 flexCenter md:my-0 my-10 relative"
      variants={slideIn("left", "tween", 0.2, 1.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <Image
        src={intr1}
        alt="billing"
        width={0}
        height={0}
        className="py-8 sm:w-[50%] w-[50%] sm:h-[50%] h-[50%] relative z-[0]"
        priority={true}
      />

      {/* gradient start
        // <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        // <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        // <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" /> */}
      {/* gradient end */}

      {/* Generate multiple wave effects */}
      {waves.map((waveKey) => (
        <div
          key={waveKey}
          className="absolute inset-0 w-full h-full rounded-full animate-wave"
          style={{
            background:
              "radial-gradient(circle, rgba(169, 169, 169, 0.5), rgba(169, 169, 169, 0))",
            animationDuration: "2s",
          }}
        />
      ))}

      {/* <button
        onClick={handlePlayAudio}
        className="absolute bottom-0 p-3 bg-blue-500 text-white rounded-md"
      >
        Play Audio and Show Waves /{" "}
      </button> */}
    </motion.div>

    //   <div className="relative flex items-center justify-center w-1/3 h-96 bg-primary ">
    //     {/* Image */}
    //     <img src="/intr1.png" alt="Interactive Image" className=" h-auto z-10 items-center " />

    // {/* Generate multiple wave effects */}
    // {waves.map((waveKey) => (
    //   <div
    //     key={waveKey}
    //     className="absolute inset-0 w-full h-full rounded-full animate-wave"
    //     style={{
    //       background: "radial-gradient(circle, rgba(169, 169, 169, 0.5), rgba(169, 169, 169, 0))",
    //       animationDuration: "2s",
    //     }}
    //   />
    // ))}

    //     {/* Button to trigger audio and wave effect */}
    //     <button
    //       onClick={handlePlayAudio}
    //       className="absolute bottom-0 p-3 bg-blue-500 text-white rounded-md"
    //     >
    //       Play Audio and Show Waves
    //     </button>
    //   </div>
  );
};

export default VisualizerOne;
