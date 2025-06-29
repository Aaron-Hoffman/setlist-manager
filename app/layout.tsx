import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Setlist Manager",
  description: "Create and Manage Setlists With Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <div className="min-h-screen">
          <Header />
          <div className="min-h-[calc(100vh-256px)]">
            {children}
          </div>
          <Footer />      
        </div>
      </body>
    </html>
  );
}
