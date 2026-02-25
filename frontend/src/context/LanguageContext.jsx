import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SUPPORTED_LANGUAGES, translations } from "../i18n/translations";

const STORAGE_KEY = "medai_language";

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }
  return "English";
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => translations[language]?.[key] ?? translations.English[key] ?? key;
    return { language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

