import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const SUPPORTED_LANGUAGES = ["English", "Hindi", "Kannada"];

function readLanguageFromStorage() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const nestedLanguage = storedUser?.user?.language;
    const flatLanguage = storedUser?.language;
    const language = nestedLanguage || flatLanguage || "English";

    return SUPPORTED_LANGUAGES.includes(language) ? language : "English";
  } catch {
    return "English";
  }
}

function writeLanguageToStorage(language) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      return;
    }

    const updatedUser = {
      ...storedUser,
      language,
      user: storedUser.user ? { ...storedUser.user, language } : storedUser.user,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  } catch {
    // Ignore invalid localStorage payloads.
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readLanguageFromStorage);

  useEffect(() => {
    document.documentElement.lang = language === "Hindi" ? "hi" : language === "Kannada" ? "kn" : "en";
  }, [language]);

  const setLanguage = (nextLanguage) => {
    const safeLanguage = SUPPORTED_LANGUAGES.includes(nextLanguage) ? nextLanguage : "English";
    setLanguageState(safeLanguage);
    writeLanguageToStorage(safeLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
