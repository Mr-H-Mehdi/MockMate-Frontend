"use client";
import { motion } from "framer-motion";
import { zoomIn } from "../../styles/animations";
import { quotes } from "../../../public";
import Image, { StaticImageData } from "next/image";
import { useTheme } from "./ThemeContext";

interface feedbackCardPropTypes {
  content: string;
  name: string;
  title: string;
  img: string | StaticImageData;
}

const FeedBackCard = ({ content, name, title, img }: feedbackCardPropTypes) => {
  const { theme } = useTheme(); // use theme context
  const isLight = theme === "light";

  return (
    <motion.div
      className={`flex justify-between flex-col px-10 py-12 rounded-[20px] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card 
        ${isLight ? "bg-white shadow-md" : "bg-[#1f1f1f]"}`}
      variants={zoomIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <Image
        src={quotes}
        alt="quotes"
        width={42}
        height={27}
        className="object-contain"
        priority={true}
      />
      <p
        className={`font-poppins font-normal text-[18px] leading-[32px] my-10 ${
          isLight ? "text-gray-800" : "text-white"
        }`}
      >
        {content}
      </p>
      <div className="flex">
        <Image
          src={img}
          alt={name}
          width={48}
          height={48}
          className="rounded-full object-contain"
          priority={true}
        />
        <div className="flex flex-col ml-4">
          <h1
            className={`font-poppins font-semibold text-[20px] leading-[32px] ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {name}
          </h1>
          <p
            className={`font-poppins font-normal text-[16px] leading-[24px] ${
              isLight ? "text-gray-600" : "text-dimWhite"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedBackCard;
