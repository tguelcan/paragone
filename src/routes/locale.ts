export default {
  en: {
    demo: {
      title: "paragone Demo",
      subtitle: "Simple i18n for SvelteKit",
      welcome: "Welcome to paragone!",
      greeting: "Hello, {{name}}!",
      description:
        "This is a working example of paragone in action. Switch languages using the buttons below.",
      counter: "You clicked {{count}} times",
      features: {
        title: "Features",
        cookies: "Cookie-based persistence",
        reactive: "Reactive with Svelte 5 Runes",
        typed: "TypeScript support",
        simple: "Easy to use",
      },
    },
    actions: {
      switchLanguage: "Switch Language",
      increment: "Click me",
    },
  },
  de: {
    demo: {
      title: "paragone Demo",
      subtitle: "Einfache i18n für SvelteKit",
      welcome: "Willkommen bei paragone!",
      greeting: "Hallo, {{name}}!",
      description:
        "Dies ist ein funktionierendes Beispiel von paragone. Wechsle die Sprache mit den Buttons unten.",
      counter: "Du hast {{count}} mal geklickt",
      features: {
        title: "Features",
        cookies: "Cookie-basierte Speicherung",
        reactive: "Reaktiv mit Svelte 5 Runes",
        typed: "TypeScript Unterstützung",
        simple: "Einfach zu nutzen",
      },
    },
    actions: {
      switchLanguage: "Sprache wechseln",
      increment: "Klick mich",
    },
  },
} as const;
