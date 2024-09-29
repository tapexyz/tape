"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { components } from ".";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <aside className="no-scrollbar sticky top-[100px] bottom-0 z-10 hidden h-[calc(100vh-100px)] overflow-y-auto border-custom px-6 py-3 md:block md:border-x">
      <h1 className="py-5 font-bold text-xs uppercase">Components</h1>
      <ul className="w-full">
        {components.map(({ id, label }) => (
          <li
            key={id}
            onFocus={() => setActiveTab(id)}
            onMouseOver={() => setActiveTab(id)}
            onMouseLeave={() => setActiveTab("")}
          >
            <Link
              className="-mx-3 relative flex rounded-custom px-3 py-2 text-secondary/70 capitalize no-underline outline-none"
              href={`#${id}`}
              prefetch={false}
            >
              {activeTab === id ? (
                <motion.span
                  key={activeTab}
                  layoutId="link-indicator"
                  transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                  className="absolute inset-0 rounded-custom bg-secondary"
                />
              ) : null}
              <span className="relative">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
