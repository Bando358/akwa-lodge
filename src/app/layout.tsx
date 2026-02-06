import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://akwaluxurylodge.com"),
  title: {
    default: "Akwa Luxury Lodge | Hôtel de luxe à Jacqueville, Côte d'Ivoire",
    template: "%s | Akwa Luxury Lodge",
  },
  description:
    "Découvrez Akwa Luxury Lodge, un hôtel de luxe situé en bord de mer à Jacqueville, Côte d'Ivoire. Hébergement haut de gamme, restaurant gastronomique, événements et conférences.",
  keywords: [
    "hôtel luxe Côte d'Ivoire",
    "Jacqueville",
    "lodge",
    "hébergement bord de mer",
    "restaurant Jacqueville",
    "événements Côte d'Ivoire",
    "conférences Abidjan",
    "mariage Jacqueville",
    "vacances Côte d'Ivoire",
  ],
  authors: [{ name: "Akwa Luxury Lodge" }],
  creator: "Akwa Luxury Lodge",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://akwalodge.com",
    siteName: "Akwa Luxury Lodge",
    title: "Akwa Luxury Lodge | Hôtel de luxe à Jacqueville",
    description:
      "Un havre de paix en bord de mer. Découvrez l'élégance naturelle d'Akwa Luxury Lodge à Jacqueville, Côte d'Ivoire.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Akwa Luxury Lodge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akwa Luxury Lodge | Hôtel de luxe à Jacqueville",
    description: "Un havre de paix en bord de mer.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
