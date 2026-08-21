import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "UniEnrich AI – Intelligent Product Data Enrichment Platform",
  description: "Transform messy industrial product catalogs into structured, searchable, AI-enriched product data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black-900 text-white-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
