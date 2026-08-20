import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YatraLink",
  description: "Travel Better. Support Local. Preserve Heritage.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#086C6E", // Deep Teal
};

import { AppProvider } from "@/context/AppContext";
import { ResetDemo } from "@/components/ResetDemo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-bg-base)] text-[var(--color-brand-secondary)] pb-[env(safe-area-inset-bottom)]">
        <AppProvider>
          {children}
          <ResetDemo />
        </AppProvider>
      </body>
    </html>
  );
}
