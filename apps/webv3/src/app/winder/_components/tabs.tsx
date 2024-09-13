import { motion } from "framer-motion";
import { useState } from "react";

const items = ["for you", "explore", "following", "bangers", "studio"];

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <ul className="flex items-center">
      {items.map((item, index) => (
        <li
          key={item}
          onFocus={() => setActiveTab(index)}
          onMouseOver={() => setActiveTab(index)}
          onMouseLeave={() => setActiveTab(index)}
          className={`relative cursor-pointer px-4 py-1 ${activeTab === index ? "text-gray-900" : "text-gray-500"}`}
        >
          {activeTab === index ? (
            <motion.span
              key={activeTab}
              layoutId="tab-indicator"
              transition={{ duration: 0.3, bounce: 0, type: "spring" }}
              className="-z-10 absolute inset-0 rounded-full bg-gray-100"
            />
          ) : null}
          <span className="relative">{item}</span>
        </li>
      ))}
    </ul>
  );
};
