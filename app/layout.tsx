import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Muhamed Ahmed · Portfolio",
    template: "%s · Muhamed Ahmed",
  },
  description:
    "Portfolio of Muhamed Ahmed Shifaw — Software Developer and Computer Science graduate. Explore my work, skills, and experience.",
};

const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('darkMode')==='true'){document.body.classList.add('dark-mode');}}catch(e){}`;

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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}