import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

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
      <body className="bg-black-900 text-white-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
