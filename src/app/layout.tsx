import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Brasil de Perto | ${siteConfig.companyName}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description:
    "Consultoria e oportunidades imobiliárias no Brasil para brasileiros que vivem na Europa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
