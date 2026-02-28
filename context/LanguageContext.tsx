"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("app-language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  // Save language
  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);