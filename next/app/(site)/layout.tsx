import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AccentStrip } from "@/components/AccentStrip";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ramon Roca‑Pinilla, PhD — Portfolio",
  description:
    "Research Officer at CMRI (TVU). Antimicrobial proteins, phage/AAV, and translational vectorology.",
  metadataBase: new URL("https://rrocap.github.io/Portfolio"),
  openGraph: {
    title: "Ramon Roca‑Pinilla, PhD",
    description:
      "Antimicrobial proteins, phage‑AAV, translational vectorology. Publications, projects, and music.",
    url: "https://rrocap.github.io/Portfolio/",
    siteName: "Ramon Roca‑Pinilla",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: "index,follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable}`}>
      <body>
        <AccentStrip />
        <NavBar />
        <main className="mx-auto max-w-6xl px-6 md:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

