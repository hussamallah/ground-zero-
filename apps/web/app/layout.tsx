
import type { ReactNode } from "react";
import "./globals.css";
import Analytics from "./components/Analytics";

export const metadata = {
  title: {
    default: "Ground Zero",
    template: "%s | Ground Zero"
  },
  description: "Quiz engine, Next.js edition",
  keywords: ["quiz", "education", "learning", "assessment"],
  authors: [{ name: "Ground Zero Team" }],
  creator: "Ground Zero",
  publisher: "Ground Zero",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Ground Zero',
    description: 'Quiz engine, Next.js edition',
    siteName: 'Ground Zero',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ground Zero',
    description: 'Quiz engine, Next.js edition',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
