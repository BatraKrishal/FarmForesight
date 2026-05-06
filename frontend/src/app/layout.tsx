import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FarmForesight - Agricultural Recommendation",
  description: "ML-based agricultural recommendation system for farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative bg-slate-50 text-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/40 via-white to-accent-100/20 pointer-events-none -z-10" />
        
        <Header />
        
        <main className="flex-1 flex flex-col relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
