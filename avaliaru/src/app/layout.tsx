import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "AvaliaRU",
  description: "Avaliação do Restaurante Universitário da Unb Gama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        <Toaster />
      </body>

    </html>
  );
}
