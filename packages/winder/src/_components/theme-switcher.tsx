import { m } from "framer-motion";
import { Desktop, Moon, Sun } from "../icons";
import { useTheme } from "../theme";
import { Button } from "./button";

const getIcon = (theme: string, weight: "fill" | "regular") => {
  switch (theme) {
    case "system":
      return <Desktop weight={weight} />;
    case "light":
      return <Sun weight={weight} />;
    case "dark":
      return <Moon weight={weight} />;
  }
};

export const ThemeSwitcher = () => {
  const { setTheme, theme: currentTheme = "system", themes } = useTheme();

  const getNextTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex] || "system";
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="backdrop-blur-3xl"
      onClick={() => setTheme(getNextTheme())}
    >
      {getIcon(getNextTheme(), "fill")}
    </Button>
  );
};

export const ThemeSwitcherExpanded = ({ id }: Readonly<{ id: string }>) => {
  const { setTheme, theme: currentTheme = "system", themes } = useTheme();

  return (
    <div className="inline-flex h-9 items-center gap-0.5 rounded-full border border-custom bg-secondary p-1 transition-shadow hover:shadow-inner">
      {themes.map((theme) => (
        <button
          key={theme}
          type="button"
          className="relative rounded-full p-1.5"
          onClick={() => setTheme(theme)}
        >
          {currentTheme === theme ? (
            <m.span
              key={currentTheme}
              layoutId={`${id}-theme-switcher`}
              transition={{ duration: 0.2, bounce: 0, type: "spring" }}
              className="absolute inset-0 rounded-full bg-theme"
            />
          ) : null}
          <span className="relative">{getIcon(theme, "regular")}</span>
        </button>
      ))}
    </div>
  );
};
