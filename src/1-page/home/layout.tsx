import "@/src/5-shared/style/global.scss";
import "@/src/3-feature/theme/index.scss";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeInitialization } from "@/src/3-feature/theme/component";

import type { HomeLayoutProps } from "./type";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notepad",
  description: "A local, tab-based writing workspace",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: HomeLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="youtube-theme">
        <ThemeInitialization />
        {children}
      </body>
    </html>
  );
}
