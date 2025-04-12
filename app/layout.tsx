import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientComponent";
import { SchematicProvider } from "@schematichq/schematic-react";
import Header from "./components/Header";
import AppSidebar from "./components/AppSidebar";
import { YoutubeHistoryProvider } from "@/context/YoutubeHistoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Tube",
  description: "Coded By Rohit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <YoutubeHistoryProvider>
            <div className="flex flex-col h-screen">
              <Header className="z-50" /> {/* Ensuring header has higher z-index */}
              <div className="flex-1 flex overflow-hidden relative">
                <AppSidebar>{children}</AppSidebar>
              </div>
            </div>
          </YoutubeHistoryProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
