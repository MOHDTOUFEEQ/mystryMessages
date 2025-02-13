"use client";

import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./AuthProciver";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
import  Providers  from "../lib/Provider";

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
  const pathname = usePathname();

  const shouldShowNavbar = !pathname.startsWith("/u") && !pathname.startsWith("/messages");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider >
          <Providers  >
          {shouldShowNavbar && <Navbar />}
          {children}
        </Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
