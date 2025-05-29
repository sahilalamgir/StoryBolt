import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from "@/components/QueryProvider";
import { StoryProvider } from "@/contexts/StoryContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import SignUpLauncher from "@/components/SignUpLauncher";
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryBolt",
  description: "Generate your own stories with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <StoryProvider>
              <Navbar />
              <Suspense fallback={<div>Loading...</div>}>
              <SignUpLauncher />
              </Suspense>
              {children}
              <Footer />
              <Analytics />
            </StoryProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
