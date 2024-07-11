import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import Providers from "./components/Providers";
import ThemeWrapper from "./components/ThemeWrapper";
import "./globals.scss";
import AppInitializer from "./layouts/AppInitializer";
import { Toaster } from "react-hot-toast";
import { prisma } from "@/prisma/client";
import MainPageLoader from "./layouts/MainPageLoader";
import ThemeProvider from "./contexts/ThemeProvider";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>

      <body className={plus_jakarta_sans.className}>
        <ThemeProvider>
          <Suspense>
            <Providers>
              <Toaster></Toaster>
              <AppInitializer></AppInitializer>
              <MainPageLoader>{children}</MainPageLoader>
            </Providers>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
