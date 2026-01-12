import { Inter, Playfair_Display } from "next/font/google";

export const maisonSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-maison-sans",
});

export const maisonDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-maison-display",
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = `${maisonSans.variable} ${maisonDisplay.variable}`;
