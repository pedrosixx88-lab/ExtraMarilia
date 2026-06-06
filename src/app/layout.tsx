import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ExtraMarília — Serviços locais em Marília/SP",
    template: "%s | ExtraMarília",
  },
  description:
    "Plataforma hiperlocal de serviços em Marília/SP. Publique o que você precisa e receba contato de prestadores locais pelo WhatsApp.",
  keywords: ["serviços", "Marília", "SP", "diarista", "pedreiro", "eletricista", "local"],
  openGraph: {
    title: "ExtraMarília — Serviços locais em Marília/SP",
    description: "Encontre prestadores de serviço em Marília/SP ou publique o que você precisa.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn(syne.variable, dmSans.variable)}>
      <body className="min-h-screen bg-brand-cream font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
