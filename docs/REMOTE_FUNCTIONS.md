# Remote Functions für Language Switching

## Warum ist `changeLanguage` nicht in der Library enthalten?

SvelteKit's `command()` und `$app/server` funktionieren nur im Kontext eines SvelteKit-Projekts und können nicht aus einer npm-Library exportiert werden. Daher musst du die Remote-Funktion in deinem eigenen Projekt erstellen.

**Vorteil:** Du hast volle Kontrolle über die Implementierung und kannst sie an deine Bedürfnisse anpassen.

## Implementierung im eigenen Projekt

### Option 1: Mit SvelteKit Remote Commands (empfohlen)

Erstelle eine Datei `src/lib/changeLanguage.ts`:

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import z from "zod";

/**
 * Remote function to change the user's language preference
 * @example await changeLanguage('de')
 */
export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    setLanguage(event.cookies, language);
    return { success: true, language };
  }
);
```

**Verwendung in Komponenten:**

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from '$lib/changeLanguage';
  
  async function switchLanguage(lang: string) {
    await changeLanguage(lang);
    await invalidateAll(); // Lädt die Seite mit neuer Sprache neu
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

### Option 2: Mit Form Actions

Erstelle in `src/routes/+page.server.ts`:

```typescript
import type { Actions } from './$types';
import { setLanguage } from 'paragone';

export const actions = {
  changeLanguage: async ({ request, cookies }) => {
    const data = await request.formData();
    const language = data.get('language')?.toString();
    
    if (language) {
      setLanguage(cookies, language);
    }
    
    return { success: true };
  }
} satisfies Actions;
```

**Verwendung in Komponenten:**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/changeLanguage" use:enhance>
  <input type="hidden" name="language" value="en" />
  <button type="submit">English</button>
</form>

<form method="POST" action="?/changeLanguage" use:enhance>
  <input type="hidden" name="language" value="de" />
  <button type="submit">Deutsch</button>
</form>
```

### Option 3: Mit API Route

Erstelle `src/routes/api/language/+server.ts`:

```typescript
import type { RequestHandler } from './$types';
import { setLanguage } from 'paragone';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { language } = await request.json();
  
  if (language && typeof language === 'string') {
    setLanguage(cookies, language);
    return json({ success: true, language });
  }
  
  return json({ success: false }, { status: 400 });
};
```

**Verwendung in Komponenten:**

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  
  async function switchLanguage(lang: string) {
    const response = await fetch('/api/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang })
    });
    
    if (response.ok) {
      await invalidateAll();
    }
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

## Erweiterte Beispiele

### Mit Validierung und Fehlerbehandlung

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage, getConfig } from "paragone";
import z from "zod";

export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    const config = getConfig();
    
    // Prüfe, ob Sprache unterstützt wird
    if (!config.supportedLanguages.includes(language)) {
      return { 
        success: false, 
        error: 'Language not supported' 
      };
    }
    
    setLanguage(event.cookies, language);
    
    return { 
      success: true, 
      language,
      message: `Language changed to ${language}`
    };
  }
);
```

### Mit Logging

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import z from "zod";

export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    const userId = event.locals.user?.id;
    
    setLanguage(event.cookies, language);
    
    // Logge den Sprachwechsel
    console.log(`User ${userId} changed language to ${language}`);
    
    // Optional: Speichere in Datenbank
    // await db.updateUserLanguage(userId, language);
    
    return { success: true, language };
  }
);
```

### Mit Redirect

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import { redirect } from '@sveltejs/kit';
import z from "zod";

export const changeLanguage = command(
  z.object({
    language: z.string().min(2).max(10),
    redirectTo: z.string().optional()
  }),
  async ({ language, redirectTo }) => {
    const event = getRequestEvent();
    setLanguage(event.cookies, language);
    
    if (redirectTo) {
      throw redirect(303, redirectTo);
    }
    
    return { success: true, language };
  }
);
```

## Häufige Fehler

### ❌ Fehler: "changeLanguage is not a function"

**Problem:** Du versuchst, `changeLanguage` aus `paragone` zu importieren.

**Lösung:** Erstelle die Funktion in deinem eigenen Projekt (siehe Optionen oben).

### ❌ Fehler: "$app/server is not defined"

**Problem:** Du versuchst, `command()` im Client-Code zu verwenden.

**Lösung:** Stelle sicher, dass die Datei `.ts` (nicht `.svelte`) ist und sich in einem geeigneten Verzeichnis befindet (z.B. `$lib/`).

### ❌ Fehler: Sprache ändert sich nicht

**Problem:** Du vergisst, `invalidateAll()` aufzurufen.

**Lösung:** Rufe nach dem Sprachwechsel immer `invalidateAll()` auf:

```typescript
await changeLanguage('de');
await invalidateAll(); // ← Wichtig!
```

## Best Practices

1. **Verwende Zod für Validierung** - Verhindert ungültige Sprachen
2. **Rufe `invalidateAll()` auf** - Damit die Seite mit neuer Sprache neu lädt
3. **Zeige Feedback** - Toast-Notification nach erfolgreichem Wechsel
4. **Persistiere in DB** - Speichere Sprachpräferenz für angemeldete User
5. **Fehlerbehandlung** - Zeige Fehlermeldung bei Problemen

## Zusammenfassung

| Methode | Vorteile | Nachteile |
|---------|----------|-----------|
| **Command** | Modern, Type-safe, Progressive Enhancement | Benötigt Zod |
| **Form Actions** | Funktioniert ohne JS, SvelteKit-Standard | Mehr Boilerplate |
| **API Route** | Flexibel, REST-konform | Mehr Code, kein Progressive Enhancement |

**Empfehlung:** Verwende `command()` für moderne SvelteKit-Apps mit Svelte 5.