import localFont from "next/font/local";

export const serifFont = localFont({
  src: "./_fonts/serif.woff2",
  fallback: ["ui-serif", "serif"],
  display: "swap",
  preload: true,
  variable: "--tape-font-serif"
});

export const sansFont = localFont({
  src: "./_fonts/sans.woff2",
  fallback: ["ui-sans-serif", "system-ui"],
  display: "swap",
  preload: true,
  variable: "--tape-font-sans"
});
