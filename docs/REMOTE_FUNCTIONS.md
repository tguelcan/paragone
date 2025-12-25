# Remote Functions for Language Switching

## Why is `changeLanguage` not included in the library?

SvelteKit's `command()` and `$app/server` only work in the context of a SvelteKit project and cannot be exported from an npm library. Therefore, you need to create the remote function in your own project.

**Advantage:** You have full control over the implementation and can adapt it to your needs.

## Implementation in Your Own Project

### Option 1: With SvelteKit Remote Commands (recommended)

Create a file `src/lib/changeLanguage.ts`:

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

**Usage in Components:**

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from '$lib/changeLanguage';
  
  async function switchLanguage(lang: string) {
    await changeLanguage(lang);
    await invalidateAll(); // Reloads the page with the new language
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

### Option 2: With Form Actions

Create in `src/routes/+page.server.ts`:

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

**Usage in Components:**

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

### Option 3: With API Route

Create `src/routes/api/language/+server.ts`:

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

**Usage in Components:**

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

## Advanced Examples

### With Validation and Error Handling

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage, getConfig } from "paragone";
import z from "zod";

export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    const config = getConfig();
    
    // Check if language is supported
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

### With Logging

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
    
    // Log the language change
    console.log(`User ${userId} changed language to ${language}`);
    
    // Optional: Save to database
    // await db.updateUserLanguage(userId, language);
    
    return { success: true, language };
  }
);
```

### With Redirect

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

## Common Errors

### ❌ Error: "changeLanguage is not a function"

**Problem:** You're trying to import `changeLanguage` from `paragone`.

**Solution:** Create the function in your own project (see options above).

### ❌ Error: "$app/server is not defined"

**Problem:** You're trying to use `command()` in client code.

**Solution:** Make sure the file is `.ts` (not `.svelte`) and is located in an appropriate directory (e.g. `$lib/`).

### ❌ Error: Language doesn't change

**Problem:** You forgot to call `invalidateAll()`.

**Solution:** Always call `invalidateAll()` after changing the language:

```typescript
await changeLanguage('de');
await invalidateAll(); // ← Important!
```

## Best Practices

1. **Use Zod for validation** - Prevents invalid languages
2. **Call `invalidateAll()`** - So the page reloads with the new language
3. **Show feedback** - Toast notification after successful change
4. **Persist in DB** - Save language preference for authenticated users
5. **Error handling** - Show error message when problems occur

## Summary

| Method | Advantages | Disadvantages |
|---------|----------|-----------|
| **Command** | Modern, Type-safe, Progressive Enhancement | Requires Zod |
| **Form Actions** | Works without JS, SvelteKit standard | More boilerplate |
| **API Route** | Flexible, REST-compliant | More code, no Progressive Enhancement |

**Recommendation:** Use `command()` for modern SvelteKit apps with Svelte 5.