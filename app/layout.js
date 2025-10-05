import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});
import "./globals.css";

export const metadata = {
  title: "HabitForge - Build Better Habits",
  description: "A modern and aesthetic habit tracking application to help you build better habits.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
