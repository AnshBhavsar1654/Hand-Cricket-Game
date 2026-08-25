import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Hand Cricket",
  description: "A hand cricket game — quick bat or full match against the CPU.",
};

const themeInit = `(() => {
  try {
    const t = localStorage.getItem("hc-theme");
    if (t === "light" || (!t && window.matchMedia("(prefers-color-scheme: light)").matches)) {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans transition-colors duration-300">{children}</body>
    </html>
  );
}
