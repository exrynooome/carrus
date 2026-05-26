import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/src/providers/queryProvider";
import "@/src/styles/globals.scss";
import {HeroProvider} from "@/src/providers/herouiProvider";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer"

const involve = localFont({
  src: '../styles/fonts/involve/fonts/Involve-VF.ttf',
  variable: '--font-involve',
})

const inter = Inter({
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Carrus",
  description: "Автомобили из Америки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${involve.className} ${inter.variable} h-full antialiased`}
    >
      <body className="dark min-h-full flex flex-col">
        <HeroProvider>
          <QueryProvider>
            <Header />
            {children}
            <Footer />
          </QueryProvider>
        </HeroProvider>
      </body>
    </html>
  );
}
