import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";
import { LivesProvider } from "@/context/LivesContext";
import { StudyProvider } from "@/context/StudyContext";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Learnisle",
  description: "PDF to game levels learning app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >

          <LanguageProvider>

            {/* ❤️ Lives System */}
            <LivesProvider>

              {/* 📚 Study Timer System */}
              <StudyProvider>

                {children}

              </StudyProvider>

            </LivesProvider>

          </LanguageProvider>

        </ThemeProvider>

        {/* 📊 Vercel Analytics */}
        <Analytics />

      </body>
    </html>
  );
}