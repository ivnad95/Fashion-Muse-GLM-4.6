import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FASHION MUSE Studio - AI-Powered Fashion Photography",
  description: "Transform your photos into professional fashion art with AI. Create stunning photoshoots in 8 different styles.",
  keywords: ["Fashion", "AI", "Photography", "Photoshoot", "Studio", "Fashion Muse"],
  authors: [{ name: "FASHION MUSE Studio" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "FASHION MUSE Studio",
    description: "Transform your photos into professional fashion art with AI",
    url: "https://fashion-muse-studio.com",
    siteName: "FASHION MUSE Studio",
    type: "website",
    images: [
      {
        url: "/logo.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FASHION MUSE Studio",
    description: "Transform your photos into professional fashion art with AI",
    images: [
      "/logo.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
