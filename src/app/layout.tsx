import type { Metadata } from "next";
import { Host_Grotesk, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Savytics – Modern Project Tracker",
  description: "A production-grade, visually distinctive project management application built for Savytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen antialiased bg-[#fffdf5] text-[#253044]">
        <QueryProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              className: "font-sans border-2 border-[#252b3a] shadow-[3px_3px_0_0_#252b3a] rounded-xl text-xs font-bold",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
