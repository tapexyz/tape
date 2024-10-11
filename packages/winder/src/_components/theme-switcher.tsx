"use client";

import { useIsClient } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Desktop, Moon, Sun } from "../icons";
import { Button } from "./button";

const getIcon = (theme: string) => {
  switch (theme) {
    case "system":
      return <Desktop />;
    case "light":
      return <Sun />;
    case "dark":
      return <Moon />;
  }
};

export const ThemeSwitcher = () => {
  const isClient = useIsClient();
  const { setTheme, themes, theme: currentTheme = "system" } = useTheme();

  const getNextTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex] || "system";
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={() => setTheme(getNextTheme())}
    >
      {isClient ? getIcon(getNextTheme()) : null}
    </Button>
  );
};

export const ThemeSwitcherExpanded = ({ id }: Readonly<{ id: string }>) => {
  const isClient = useIsClient();
  const { setTheme, themes, theme: currentTheme } = useTheme();

  return (
    <div className="inline-flex h-9 items-center gap-0.5 rounded-full border border-custom bg-secondary p-1 transition-shadow hover:shadow-inner">
      {themes.map((theme) => (
        <button
          key={theme}
          type="button"
          className="relative rounded-full p-1.5"
          onClick={() => setTheme(theme)}
        >
          {isClient && currentTheme === theme ? (
            <motion.span
              key={currentTheme}
              layoutId={`${id}-theme-switcher`}
              transition={{ duration: 0.2, bounce: 0, type: "spring" }}
              className="absolute inset-0 rounded-full bg-theme"
            />
          ) : null}
          <span className="relative">{getIcon(theme)}</span>
        </button>
      ))}
    </div>
  );
};
