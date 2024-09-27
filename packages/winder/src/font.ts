import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const serifFont = localFont({
  src: "./_fonts/serif.woff2",
  fallback: ["ui-serif", "serif"],
  display: "swap",
  preload: true,
  variable: "--font-editorial"
});

export const sansFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist"
});
