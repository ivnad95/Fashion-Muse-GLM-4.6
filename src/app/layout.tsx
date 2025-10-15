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
    icon: "https://z-cdn.chatglm.cn/files/fab48b0c-dd0e-44b8-a6cb-cc2965fc53c6_pmlogo1%20%281%29.png?auth_key=1792007954-723675d1b3c8408c8011b668600c44c2-0-3d288ad2b296041186aeea0bf0e03f7f",
  },
  openGraph: {
    title: "FASHION MUSE Studio",
    description: "Transform your photos into professional fashion art with AI",
    url: "https://fashion-muse-studio.com",
    siteName: "FASHION MUSE Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FASHION MUSE Studio",
    description: "Transform your photos into professional fashion art with AI",
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
