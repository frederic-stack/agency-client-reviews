import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClientScore - Anonymous Client Reviews for Agencies",
  description: "A secure platform for agencies and vendors to anonymously review their client experiences. Share insights, discover reliable clients, and make informed business decisions.",
  keywords: ["client reviews", "agency", "vendor", "anonymous", "business reviews", "client feedback"],
  authors: [{ name: "ClientScore Team" }],
  creator: "ClientScore",
  publisher: "ClientScore",
  metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'),
  openGraph: {
    title: "ClientScore - Anonymous Client Reviews for Agencies",
    description: "A secure platform for agencies and vendors to anonymously review their client experiences.",
    url: "/",
    siteName: "ClientScore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClientScore - Anonymous Client Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientScore - Anonymous Client Reviews for Agencies",
    description: "A secure platform for agencies and vendors to anonymously review their client experiences.",
    images: ["/og-image.png"],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div id="root" className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
