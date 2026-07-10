import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Orbital - AI GTM Workspace",
  description: "Manage outbound campaigns intelligently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body suppressHydrationWarning className="flex min-h-screen bg-neutral-950 text-neutral-50">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
