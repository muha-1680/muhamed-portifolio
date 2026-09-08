import type { Metadata } from "next";
import "./globals.css";
import DarkModeBody from "./dark-mode-body";

export const metadata: Metadata = {
  title: {
    default: "Muhamed Ahmed · Portfolio",
    template: "%s · Muhamed Ahmed",
  },
  description:
    "Portfolio of Muhamed Ahmed Shifaw — Software Developer and Computer Science graduate. Explore my work, skills, and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <DarkModeBody />
        {children}
      </body>
    </html>
  );
}
