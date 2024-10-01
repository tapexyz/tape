"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { base, components } from "./map";

const Li = ({ item }: { item: { id: string; label: string } }) => {
  const { id, label } = item;
  const [hoverTab, setHoverTab] = useState("");

  return (
    <li
      onFocus={() => setHoverTab(id)}
      onMouseOver={() => setHoverTab(id)}
      onMouseLeave={() => setHoverTab("")}
    >
      <Link
        className="-mx-3 relative flex rounded-custom px-3 py-2 text-primary/70 capitalize no-underline outline-none"
        href={`#${id}`}
        prefetch={false}
      >
        {hoverTab === id ? (
          <motion.span
            key={hoverTab}
            layoutId="winder-sidebar-link-indicator"
            transition={{ duration: 0.2, bounce: 0, type: "spring" }}
            className="absolute inset-0 rounded-custom bg-secondary"
          />
        ) : null}
        <span className="relative">{label}</span>
      </Link>
    </li>
  );
};

export const Sidebar = () => {
  return (
    <aside className="no-scrollbar sticky top-[100px] bottom-0 z-10 hidden h-[calc(100vh-100px)] overflow-y-auto border-custom px-6 py-4 md:block md:border-x">
      <h1 className="py-5 font-bold text-xs uppercase">Foundations</h1>
      <ul className="w-full">
        {base.map(({ id, label }) => (
          <Li key={id} item={{ id, label }} />
        ))}
      </ul>
      <h1 className="py-5 font-bold text-xs uppercase">Components</h1>
      <ul className="w-full">
        {components.map(({ id, label }) => (
          <Li key={id} item={{ id, label }} />
        ))}
      </ul>
    </aside>
  );
};
