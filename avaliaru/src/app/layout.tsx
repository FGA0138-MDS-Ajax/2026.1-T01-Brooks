import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/Header";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "AvaliaRU",
  description: "Avaliação do Restaurante Universitário da Unb Gama",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await auth(); // se não tiver sessão, sessionUser será null

  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>
        <div>
          <Header perfil={sessionUser?.user?.perfil} />

          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
