import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NeuroForgeProvider } from "@/context/NeuroForgeContext";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroForge AI — Autonomous Multi-Agent LLM Orchestrator",
  description: "Enterprise Multi-Agent LLM Consensus Mesh & Local-First Synthetic Intelligence Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#030712] text-slate-100`}>
        <NeuroForgeProvider>
          <Navbar />
          {children}
        </NeuroForgeProvider>
      </body>
    </html>
  );
}
