import { useContext } from "react";
import { useTheme } from "./ThemeContext"; // Ensure this path is correct
import { clients } from "../../constants";
import Image from "next/image";

const Clients = () => {
  const { theme } = useTheme();

  // You can define theme-based styles here or use Tailwind dark/light classes
  const backgroundClass = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textClass = theme === "dark" ? "text-white" : "text-black";

  return (
    <section className={`flexCenter my-4 ${backgroundClass} ${textClass}`}>
      <div className="flexCenter flex-wrap w-full">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex-1 flexCenter sm:min-w-[192px] min-w-[120px]"
          >
            <Image
              src={client.logo}
              alt="client"
              width={0}
              height={0}
              className="sm:w-[192px] w-[100px] object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;
