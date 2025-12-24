import type { Handle } from "@sveltejs/kit";
import { configure, getLanguage } from "$lib/index.js";

// Configure paragone (optional - these are the defaults)
configure({
  cookieName: "language",
  defaultLanguage: "en",
  supportedLanguages: ["en", "de"],
  cookieOptions: {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false,
  },
});

export const handle: Handle = async ({ event, resolve }) => {
  const language = getLanguage(
    event.cookies,
    event.request.headers.get("accept-language"),
  );

  event.locals.language = language;

  return resolve(event);
};
