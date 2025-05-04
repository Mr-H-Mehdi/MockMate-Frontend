import { useTheme } from "./ThemeContext";
import Button from "./Button";

const CTA = () => {
  const { theme } = useTheme();

  const sectionClasses = `
    flexCenter marginY padding sm:flex-row flex-col 
    ${theme === "dark" ? "bg-black-gradient-2 text-white" : "bg-white text-black"} 
    rounded-[20px] box-shadow
  `;

  return (
    <section className={sectionClasses}>
      <div className="flex-1 flex flex-col">
        <h2 className="heading2">Let&#8217;s try our service now!</h2>
        <p className="paragraph max-w-[470px] mt-5">
          We would love to have our first 'mock gossip' with you. You ready?
        </p>
      </div>

      <div className="flexCenter sm:ml-10 ml-0 sm:mt-0 mt-10">
        <Button styles="mt-10" />
      </div>
    </section>
  );
};

export default CTA;
