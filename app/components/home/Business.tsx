"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../styles/animations";
import { features } from "../../constants";
import Button from "./Button";
import { useContext } from "react";
import { useTheme } from "./ThemeContext"; // Assuming default export

interface featureCardProps {
  icon: string;
  title: string;
  content: string;
  index: number;
}

const FeatureCard = ({ icon, title, content, index }: featureCardProps) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`flex p-6 rounded-[20px] ${
        index !== features.length - 1 ? "mb-6" : "mb-0"
      } ${isDark ? "bg-darkBackground" : "bg-lightBackground"} feature-card`}
    >
      <div
        className={`w-[64px] h-[64px] rounded-full flexCenter ${
          isDark ? "bg-dimBlue" : "bg-lightBlue"
        }`}
      >
        <Image
          src={icon}
          alt="icon"
          width={0}
          height={0}
          className="w-[50%] h-[50%] object-contain"
          priority={true}
        />
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h1
          className={`font-poppins font-semibold text-[18px] leading-[23px] mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h1>
        <p
          className={`font-poppins font-normal text-[16px] leading-[24px] ${
            isDark ? "text-dimWhite" : "text-gray-700"
          }`}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

const Business = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="features"
      className={`section ${isDark ? "bg-primary" : "bg-white text-gray-900"}`}
    >
      <motion.div
        className="sectionInfo"
        variants={slideIn("left", "tween", 0.2, 1.5)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="heading2">
          You do the preparation, <br className="sm:block hidden" />
          we&#8217;ll handle the questions.
        </h2>
        <p className="paragraph max-w-[470px] mt-5">
          With MockMate, you can improve your preparation by customizing
          according to your needs and your niche. The rest is all preparations.
        </p>

        <Button styles={`mt-10`} />
      </motion.div>

      <div className="sectionImg flex-col">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            variants={fadeIn("left", "spring", index * 0.5, 1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <FeatureCard key={feature.id} {...feature} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Business;
