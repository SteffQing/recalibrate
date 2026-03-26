import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recalibrate Camp Meeting — The God of Glory",
  description:
    "Register for the Recalibrate Camp Meeting. Come expecting, come prepared — The God of Glory awaits.",
  keywords: ["Recalibrate", "Camp Meeting", "God of Glory", "Turners", "Registration"],
  openGraph: {
    title: "Recalibrate Camp Meeting — The God of Glory",
    description: "Register for the Recalibrate Camp Meeting. Come expecting, come prepared.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
