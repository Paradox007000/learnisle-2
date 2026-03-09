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
        <LanguageProvider>
          <LivesProvider>
            <StudyProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
              >
                {children}
              </ThemeProvider>
            </StudyProvider>
          </LivesProvider>
        </LanguageProvider>

        {/* ✅ Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}