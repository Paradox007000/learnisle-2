import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Learnisle",
  description: "PDF to game levels learning app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
     <body className="antialiased">
  <LanguageProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  </LanguageProvider>
</body>
    </html>
  );
}
