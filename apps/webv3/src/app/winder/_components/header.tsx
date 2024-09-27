import { Desktop, Moon, Sun } from "@tape.xyz/winder/common";
import { useIsClient } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const Header = () => {
  const isClient = useIsClient();
  const { setTheme, themes, theme: currentTheme } = useTheme();

  const getIcon = (theme: string) => {
    switch (theme) {
      case "system":
        return <Desktop weight="duotone" />;
      case "light":
        return <Sun weight="duotone" />;
      case "dark":
        return <Moon weight="duotone" />;
    }
  };

  return (
    <nav className="sticky top-0 z-10 flex h-[80px] items-center justify-between border-border border-b bg-background p-6 md:border-x">
      <h1 className="font-semibold font-serif text-2xl">tape</h1>
      <div className="flex gap-1 rounded-full bg-secondary p-0.5">
        {themes.map((theme) => (
          <button
            type="button"
            key={theme}
            className="relative rounded-full p-1.5"
            onClick={() => setTheme(theme)}
          >
            {isClient && currentTheme === theme ? (
              <motion.span
                key={currentTheme}
                layoutId="tab-indicator"
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                className="-z-10 absolute inset-0 rounded-full bg-primary-foreground"
              />
            ) : null}
            <span className="relative">{getIcon(theme)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
