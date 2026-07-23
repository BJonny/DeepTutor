import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import enApp from "@/locales/en/app.json";

export type AppLanguage = "en" | "zh" | "pt-PT";

export function normalizeLanguage(lang: unknown): AppLanguage {
  if (!lang) return "en";
  const s = String(lang).trim().toLowerCase().replaceAll("_", "-");
  if (s === "zh" || s === "cn" || s === "chinese") return "zh";
  if (s === "pt" || s === "pt-pt" || s === "portuguese" || s === "português")
    return "pt-PT";
  return "en";
}

let _initialized = false;

export function initI18n(language?: unknown) {
  if (_initialized) return i18n;

  const resources: Resource = {
    en: { app: enApp },
  };

  i18n.use(initReactI18next).init({
    resources,
    lng: normalizeLanguage(language),
    fallbackLng: "en",
    // Use a single default namespace to keep lookups simple.
    // We intentionally keep keySeparator disabled so keys like "Generating..." remain valid.
    defaultNS: "app",
    ns: ["app"],
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
    returnNull: false,
  });

  _initialized = true;
  return i18n;
}

export async function ensureLanguage(language: AppLanguage) {
  if (i18n.hasResourceBundle(language, "app")) return;
  if (language === "zh") {
    const zhApp = (await import("@/locales/zh/app.json")).default;
    i18n.addResourceBundle("zh", "app", zhApp, true, true);
  } else if (language === "pt-PT") {
    const ptPtApp = (await import("@/locales/pt-PT/app.json")).default;
    i18n.addResourceBundle("pt-PT", "app", ptPtApp, true, true);
  }
}
