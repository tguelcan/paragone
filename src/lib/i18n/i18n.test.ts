import { describe, it, expect, beforeEach, vi } from "vitest";
import { I18n, getLanguage, setLanguage } from "./i18n.js";
import type { Cookies } from "@sveltejs/kit";

// Mock translations for testing
const mockTranslations = {
  en: {
    simple: "Hello",
    greeting: "Hello, {{name}}!",
    welcome: "Welcome to {{app}}, {{name}}!",
    count: "You have {{count}} messages",
    nav: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    button: {
      save: "Save",
      cancel: "Cancel",
      delete: {
        confirm: "Delete permanently",
      },
    },
  },
  de: {
    simple: "Hallo",
    greeting: "Hallo, {{name}}!",
    welcome: "Willkommen bei {{app}}, {{name}}!",
    count: "Du hast {{count}} Nachrichten",
    nav: {
      home: "Startseite",
      about: "Über uns",
      contact: "Kontakt",
    },
    button: {
      save: "Speichern",
      cancel: "Abbrechen",
      delete: {
        confirm: "Dauerhaft löschen",
      },
    },
  },
};

// Mock Cookies object
function createMockCookies(initialData: Record<string, string> = {}): Cookies {
  const store = { ...initialData };
  return {
    get: vi.fn((name: string) => store[name]),
    set: vi.fn((name: string, value: string) => {
      store[name] = value;
    }),
    delete: vi.fn(),
    getAll: vi.fn(),
    serialize: vi.fn(),
  } as unknown as Cookies;
}

describe("I18n Class", () => {
  describe("constructor", () => {
    it("should create instance with default locale", () => {
      const i18n = new I18n(mockTranslations);
      expect(i18n.getLocale()).toBe("en");
    });

    it("should create instance with specified locale", () => {
      const i18n = new I18n(mockTranslations, "de");
      expect(i18n.getLocale()).toBe("de");
    });
  });

  describe("t() method - simple translations", () => {
    it("should return simple translation", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("simple")).toBe("Hello");
    });

    it("should return translation for different locale", () => {
      const i18n = new I18n(mockTranslations, "de");
      expect(i18n.t("simple")).toBe("Hallo");
    });

    it("should return key if translation not found", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("nonexistent")).toBe("nonexistent");
    });
  });

  describe("t() method - nested keys", () => {
    it("should return nested translation", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("nav.home")).toBe("Home");
      expect(i18n.t("nav.about")).toBe("About");
    });

    it("should return deeply nested translation", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("button.delete.confirm")).toBe("Delete permanently");
    });

    it("should return nested translation in German", () => {
      const i18n = new I18n(mockTranslations, "de");
      expect(i18n.t("nav.home")).toBe("Startseite");
      expect(i18n.t("button.save")).toBe("Speichern");
    });

    it("should return key if nested path not found", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("nav.nonexistent")).toBe("nav.nonexistent");
      expect(i18n.t("nonexistent.path.here")).toBe("nonexistent.path.here");
    });
  });

  describe("t() method - variable replacement", () => {
    it("should replace single variable", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("greeting", { name: "Tom" })).toBe("Hello, Tom!");
    });

    it("should replace multiple variables", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("welcome", { app: "TaskFlow", name: "Lisa" })).toBe(
        "Welcome to TaskFlow, Lisa!",
      );
    });

    it("should replace numeric variables", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("count", { count: 5 })).toBe("You have 5 messages");
      expect(i18n.t("count", { count: 0 })).toBe("You have 0 messages");
    });

    it("should work with variables in German", () => {
      const i18n = new I18n(mockTranslations, "de");
      expect(i18n.t("greeting", { name: "Felix" })).toBe("Hallo, Felix!");
      expect(i18n.t("count", { count: 3 })).toBe("Du hast 3 Nachrichten");
    });

    it("should handle missing variables gracefully", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("greeting")).toBe("Hello, {{name}}!");
    });

    it("should handle extra variables", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.t("simple", { unused: "value" })).toBe("Hello");
    });

    it("should replace same variable multiple times", () => {
      const translations = {
        en: {
          repeat: "{{name}} said {{name}} twice",
        },
      };
      const i18n = new I18n(translations, "en");
      expect(i18n.t("repeat", { name: "Chris" })).toBe(
        "Chris said Chris twice",
      );
    });
  });

  describe("has() method", () => {
    it("should return true for existing key", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.has("simple")).toBe(true);
    });

    it("should return true for nested key", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.has("nav.home")).toBe(true);
      expect(i18n.has("button.delete.confirm")).toBe(true);
    });

    it("should return false for non-existing key", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.has("nonexistent")).toBe(false);
    });

    it("should return false for non-existing nested key", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.has("nav.nonexistent")).toBe(false);
      expect(i18n.has("nonexistent.path.here")).toBe(false);
    });

    it("should check in correct locale", () => {
      const i18n = new I18n(mockTranslations, "de");
      expect(i18n.has("simple")).toBe(true);
      expect(i18n.has("nav.home")).toBe(true);
    });

    it("should return false for partial path", () => {
      const i18n = new I18n(mockTranslations, "en");
      expect(i18n.has("nav")).toBe(false); // nav is object, not string
    });
  });

  describe("getLocale() method", () => {
    it("should return current locale", () => {
      const i18nEn = new I18n(mockTranslations, "en");
      expect(i18nEn.getLocale()).toBe("en");

      const i18nDe = new I18n(mockTranslations, "de");
      expect(i18nDe.getLocale()).toBe("de");
    });
  });

  describe("edge cases", () => {
    it("should handle empty translations", () => {
      const i18n = new I18n({}, "en");
      expect(i18n.t("any.key")).toBe("any.key");
    });

    it("should handle empty string translation", () => {
      const translations = {
        en: {
          empty: "",
        },
      };
      const i18n = new I18n(translations, "en");
      expect(i18n.t("empty")).toBe("");
    });

    it("should handle special characters in keys", () => {
      const translations = {
        en: {
          "key-with-dash": "Value",
          key_with_underscore: "Value2",
        },
      };
      const i18n = new I18n(translations, "en");
      expect(i18n.t("key-with-dash")).toBe("Value");
      expect(i18n.t("key_with_underscore")).toBe("Value2");
    });

    it("should handle special characters in variables", () => {
      const translations = {
        en: {
          test: "Hello {{name}}",
        },
      };
      const i18n = new I18n(translations, "en");
      expect(i18n.t("test", { name: "O'Connor" })).toBe("Hello O'Connor");
      expect(i18n.t("test", { name: "Schmidt" })).toBe("Hello Schmidt");
    });
  });
});

describe("getLanguage() function", () => {
  it("should return language from cookie if exists", () => {
    const cookies = createMockCookies({ language: "de" });
    const language = getLanguage(cookies, "en-US,en;q=0.9");
    expect(language).toBe("de");
  });

  it("should parse Accept-Language header if no cookie", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "de-DE,de;q=0.9,en;q=0.8");
    expect(language).toBe("de");
  });

  it("should handle simple Accept-Language header", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "en");
    expect(language).toBe("en");
  });

  it("should respect quality values in Accept-Language", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "fr;q=0.5,de;q=0.9,en;q=0.7");
    expect(language).toBe("de");
  });

  it("should handle language with region code", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "en-US");
    expect(language).toBe("en");
  });

  it("should use first supported language from Accept-Language", () => {
    const cookies = createMockCookies();
    // Assume SUPPORTED_LANGUAGES = ['en', 'de']
    const language = getLanguage(cookies, "fr,de,en");
    expect(language).toBe("de"); // de is first supported
  });

  it("should fallback to default language if none supported", () => {
    const cookies = createMockCookies();
    // Languages not in SUPPORTED_LANGUAGES
    const language = getLanguage(cookies, "fr,es,it");
    expect(language).toBe("en"); // DEFAULT_LANGUAGE
  });

  it("should fallback to default if no Accept-Language header", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, null);
    expect(language).toBe("en");
  });

  it("should handle empty Accept-Language header", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "");
    expect(language).toBe("en");
  });

  it("should handle malformed Accept-Language header", () => {
    const cookies = createMockCookies();
    const language = getLanguage(cookies, "invalid;;;format");
    expect(language).toBe("en");
  });

  it("should prioritize cookie over Accept-Language", () => {
    const cookies = createMockCookies({ language: "en" });
    const language = getLanguage(cookies, "de-DE,de;q=0.9");
    expect(language).toBe("en"); // Cookie wins
  });
});

describe("setLanguage() function", () => {
  it("should set language cookie", () => {
    const cookies = createMockCookies();
    setLanguage(cookies, "de");
    expect(cookies.set).toHaveBeenCalledWith(
      "language",
      "de",
      expect.objectContaining({
        path: "/",
        sameSite: "lax",
        httpOnly: false,
      }),
    );
  });

  it("should set cookie with max age", () => {
    const cookies = createMockCookies();
    setLanguage(cookies, "en");
    expect(cookies.set).toHaveBeenCalledWith(
      "language",
      "en",
      expect.objectContaining({
        maxAge: 60 * 60 * 24 * 365, // 1 year
      }),
    );
  });

  it("should allow setting different languages", () => {
    const cookies = createMockCookies();
    setLanguage(cookies, "de");
    expect(cookies.set).toHaveBeenCalledWith(
      "language",
      "de",
      expect.any(Object),
    );

    setLanguage(cookies, "en");
    expect(cookies.set).toHaveBeenCalledWith(
      "language",
      "en",
      expect.any(Object),
    );
  });
});

describe("Integration tests", () => {
  it("should work with typical flow: get -> use -> set -> get", () => {
    // 1. Get language (from browser)
    let cookies = createMockCookies();
    let language = getLanguage(cookies, "de-DE");
    expect(language).toBe("de");

    // 2. Use translation
    let i18n = new I18n(mockTranslations, language);
    expect(i18n.t("simple")).toBe("Hallo");

    // 3. User changes language
    setLanguage(cookies, "en");

    // 4. Get new language (from cookie)
    cookies = createMockCookies({ language: "en" });
    language = getLanguage(cookies, "de-DE");
    expect(language).toBe("en");

    // 5. Use new translation
    i18n = new I18n(mockTranslations, language);
    expect(i18n.t("simple")).toBe("Hello");
  });

  it("should handle locale switching between multiple languages", () => {
    const languages = ["en", "de"];

    languages.forEach((lang) => {
      const i18n = new I18n(mockTranslations, lang);
      expect(i18n.getLocale()).toBe(lang);
      expect(i18n.has("simple")).toBe(true);
      expect(i18n.t("simple")).toBeTruthy();
    });
  });
});
