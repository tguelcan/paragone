import type { Cookies } from "@sveltejs/kit";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, Record<string, TranslationValue>>;

export interface ParagoneConfig {
  cookieName: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  cookieOptions: {
    path: string;
    maxAge?: number;
    sameSite?: "strict" | "lax" | "none";
    httpOnly?: boolean;
    secure?: boolean;
  };
}

let config: ParagoneConfig = {
  cookieName: "language",
  defaultLanguage: "en",
  supportedLanguages: ["en", "de"],
  cookieOptions: {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false,
  },
};

// Configure paragone with custom options
export function configure(options: Partial<ParagoneConfig>): void {
  config = {
    ...config,
    ...options,
    cookieOptions: {
      ...config.cookieOptions,
      ...options.cookieOptions,
    },
  };
}

// Get current configuration (useful for debugging)
export function getConfig(): Readonly<ParagoneConfig> {
  return config;
}

export class I18n {
  private translations: Translations;
  private locale: string;

  constructor(translations: Translations, locale?: string) {
    this.translations = translations;
    this.locale = locale || config.defaultLanguage;
  }

  // Get translation by key with optional variable replacement
  // Supports nested keys (nav.home) and variables ({{name}})
  t = (key: string, vars?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: TranslationValue | undefined = this.translations[this.locale];

    for (const k of keys) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        value = (value as Record<string, TranslationValue>)[k];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") return key;

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
  if (!acceptLanguage) return config.defaultLanguage;

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
    if (config.supportedLanguages.includes(code)) {
      return code;
    }
  }

  return config.defaultLanguage;
}

// Get language from cookie or detect from browser
export function getLanguage(
  cookies: Cookies,
  acceptLanguage: string | null,
): string {
  const language = cookies.get(config.cookieName);
  return language || getBrowserLanguage(acceptLanguage);
}

// Set language to cookie
export function setLanguage(cookies: Cookies, language: string): void {
  cookies.set(config.cookieName, language, config.cookieOptions);
}
