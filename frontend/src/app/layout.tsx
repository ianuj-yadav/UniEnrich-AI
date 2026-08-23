import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Araxyss / UniEnrich AI – Industrial Product Data Intelligence",
  description: "Transform messy industrial product catalogs into structured, searchable, AI-enriched master catalog data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fdfbfb] text-[#2b201a] min-h-screen antialiased selection:bg-[#f9c4d2] selection:text-[#382b22]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
