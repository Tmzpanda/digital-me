import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://tianmingzhang.com"),
  title: "Chat with Tim | Digital Me",
  description:
    "Chat with Tim's AI to learn about his experience as a Data Engineer at Meta, his GCP certifications, and data engineering projects.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    title: "Chat with Tim | Digital Me",
    description:
      "I built an AI version of myself. Ask it anything about my experience, skills, or projects!",
    url: "https://tianmingzhang.com",
    siteName: "Digital Tim",
    images: [
      {
        url: "/images/profile.jpg",
        width: 400,
        height: 400,
        alt: "Tianming Zhang",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chat with Tim | Digital Me",
    description:
      "I built an AI version of myself. Ask it anything about my experience, skills, or projects!",
    images: ["/images/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
