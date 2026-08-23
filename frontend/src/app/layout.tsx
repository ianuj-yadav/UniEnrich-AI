import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "UniHack AI – Industrial Product Data Intelligence",
  description: "Transform messy industrial product catalogs into structured, searchable, AI-enriched master catalog data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ed] text-[#111111] min-h-screen antialiased selection:bg-[#bae6fd] selection:text-[#0369a1]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
