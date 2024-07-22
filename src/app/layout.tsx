import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from 'shadcn';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css" rel="stylesheet"></link>
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>{children}</body>


    </html>
  );
}
