import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://google-me.in"),
  title: {
    default: "google-me - Discover & Share Your Interests",
    template: "%s | google-me",
  },
  description: "Connect with people who share your passions. Search, explore, and organize your favorite links across social media, books, movies, games, and education all in one place.",
  keywords: ["link sharing", "interests", "social media", "books", "movies", "games", "education", "profile", "discover"],
  authors: [{ name: "google-me" }],
  creator: "google-me",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://google-me.in",
    title: "google-me - Discover & Share Your Interests",
    description: "Connect with people who share your passions. Search, explore, and organize your favorite links in one place.",
    siteName: "google-me",
    images: [
      {
        url: "/images/logos/logo1.png",
        width: 1200,
        height: 630,
        alt: "google-me",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "google-me - Discover & Share Your Interests",
    description: "Connect with people who share your passions. Search, explore, and organize your favorite links in one place.",
    images: ["/images/logos/logo1.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
