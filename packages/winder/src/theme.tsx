import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themes: ["light", "dark", "system"]
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "tape-theme",
  ...props
}: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const root = window.document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleSystemThemeChange = () => {
    const systemTheme = mediaQuery.matches ? "dark" : "light";
    if (themeState === "system") {
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    }
  };

  useEffect(() => {
    root.classList.remove("light", "dark");

    if (themeState === "system") {
      handleSystemThemeChange();
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(themeState);
    }

    if (themeState === "system") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [themeState]);

  const value = {
    theme: themeState,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setThemeState(theme);
    },
    themes: ["light", "dark", "system"] as Theme[]
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
