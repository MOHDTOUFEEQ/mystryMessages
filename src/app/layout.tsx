"use client"; // Add this at the very top

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./AuthProciver";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current pathname

  // Check if the URL starts with "/u"
  const shouldShowNavbar = !pathname.startsWith("/u");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {shouldShowNavbar && <Navbar />}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
