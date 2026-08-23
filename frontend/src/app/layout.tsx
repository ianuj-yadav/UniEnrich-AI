import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "UniEnrich AI – Industrial Product Data Intelligence",
  description: "Transform messy industrial product catalogs into structured, searchable, AI-enriched master catalog data.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F2F1F0] text-[#2b3033] min-h-screen antialiased selection:bg-[#15BCDF] selection:text-[#111111]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
