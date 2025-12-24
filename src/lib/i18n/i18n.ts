import type { Cookies } from "@sveltejs/kit";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, Record<string, TranslationValue>>;

const COOKIE_NAME = "language";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "de"]; // Add your supported languages here

export class I18n {
  private translations: Translations;
  private locale: string;

  constructor(translations: Translations, locale: string = "en") {
    this.translations = translations;
    this.locale = locale;
  }

  // Get translation by key with optional variable replacement
  // Supports nested keys (nav.home) and variables ({{name}})
  t = (key: string, vars?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: TranslationValue | undefined = this.translations[this.locale];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        value = (value as Record<string, TranslationValue>)[k];
      } else {
        return key; // Fallback to key if not found
      }
    }

    if (typeof value !== "string") return key;

    // Replace variables like {{name}}
    if (vars) {
      return Object.entries(vars).reduce(
        (text, [k, v]) => text.replace(new RegExp(`{{${k}}}`, "g"), String(v)),
        value,
      );
    }

    return value;
  };

  // Check if translation key exists
  has = (key: string): boolean => {
    const keys = key.split(".");
    let value: TranslationValue | undefined = this.translations[this.locale];

    for (const k of keys) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        value = (value as Record<string, TranslationValue>)[k];
      } else {
        return false;
      }
    }

    return typeof value === "string";
  };

  // Get current locale
  getLocale = (): string => {
    return this.locale;
  };
}

// Extract browser language from Accept-Language header
function getBrowserLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  // Parse Accept-Language header (e.g. "en-US,en;q=0.9,de;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, priority] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        priority: priority ? parseFloat(priority) : 1.0,
      };
    })
    .sort((a, b) => b.priority - a.priority);
  for (const { code } of languages) {
    if (SUPPORTED_LANGUAGES.includes(code)) {
      return code;
    }
  }

  return DEFAULT_LANGUAGE;
}

// Get language from cookie or detect from browser
export function getLanguage(
  cookies: Cookies,
  acceptLanguage: string | null,
): string {
  const language = cookies.get(COOKIE_NAME);
  return language || getBrowserLanguage(acceptLanguage);
}

// Set language to cookie
export function setLanguage(cookies: Cookies, language: string): void {
  cookies.set(COOKIE_NAME, language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false,
  });
}
