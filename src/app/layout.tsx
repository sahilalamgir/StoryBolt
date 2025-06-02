import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/QueryProvider";
import { StoryProvider } from "@/contexts/StoryContext";
import { ToastProvider } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import SignUpLauncher from "@/components/SignUpLauncher";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "StoryBolt - AI-Powered Story Generator | Create Amazing Stories with AI",
    template: "%s | StoryBolt",
  },
  description:
    "Create captivating stories instantly with StoryBolt's AI story generator. Generate personalized stories across fantasy, sci-fi, romance, and more genres. Free AI-powered storytelling for everyone.",
  keywords: [
    "AI story generator",
    "story creation",
    "AI storytelling",
    "generate stories",
    "creative writing AI",
    "story maker",
    "AI stories",
    "personalized stories",
    "fantasy stories",
    "sci-fi stories",
    "StoryBolt",
  ],
  authors: [{ name: "Sahil Alamgir" }],
  creator: "Sahil Alamgir",
  publisher: "Sahil Alamgir",
  metadataBase: new URL("https://storybolt.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://storybolt.vercel.app",
    siteName: "StoryBolt",
    title: "StoryBolt - AI-Powered Story Generator",
    description:
      "Create captivating stories instantly with StoryBolt's AI story generator. Generate personalized stories across multiple genres with beautiful illustrations.",
    images: [
      {
        url: "/seo/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "StoryBolt - AI Story Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryBolt - AI-Powered Story Generator",
    description:
      "Create amazing stories with AI in seconds. Fantasy, sci-fi, romance & more!",
    creator: "@sahilalamgir",
    images: ["/seo/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // [YOUR INPUT: Create 180x180 image in public/apple-touch-icon.png]
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "G1c6lEsoa_Fk37EJG4dc4age8nKJ-uOXfFbYaiUe-Vw", // [YOUR INPUT: Get from Google Search Console]
    // yandex: "[YOUR_YANDEX_CODE]",
    // yahoo: "[YOUR_YAHOO_CODE]",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="scroll-smooth">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="canonical" href="https://storybolt.vercel.app" />
          {/* Additional SEO meta tags */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="theme-color" content="#6366f1" />
          <meta name="msapplication-TileColor" content="#6366f1" />
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "StoryBolt",
                description:
                  "AI-powered story generator that creates personalized stories with illustrations",
                url: "https://storybolt.vercel.app",
                applicationCategory: "Entertainment",
                author: {
                  "@type": "Person",
                  name: "Sahil Alamgir",
                },
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                operatingSystem: "Any",
                browserRequirements: "Requires JavaScript",
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider>
            <QueryProvider>
              <StoryProvider>
                <Navbar />
                <Suspense fallback={<div>Loading...</div>}>
                  <SignUpLauncher />
                </Suspense>
                {children}
                <Footer />
                <Analytics />
                <SpeedInsights />
              </StoryProvider>
            </QueryProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
