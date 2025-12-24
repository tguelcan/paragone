import { command, getRequestEvent } from "$app/server";
import z from "zod";
import { setLanguage } from "./i18n.js";

/**
 * Remote function to change the user's language preference
 * Uses getRequestEvent() to access cookies directly
 * @example changeLanguage('de')
 * @example changeLanguage('en')
 */
export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    setLanguage(event.cookies, language);
    return { success: true, language };
  },
);
