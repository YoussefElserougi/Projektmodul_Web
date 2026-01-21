// app/layout.tsx
// Root Layout für die gesamte App

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Change Request Portal - SWM",
  description: "Chat-basiertes Change Request Portal für die Stadtwerke München",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
