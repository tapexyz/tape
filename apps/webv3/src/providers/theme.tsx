"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
