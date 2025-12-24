// Main i18n class and helper functions
export {
  I18n,
  getLanguage,
  setLanguage,
  configure,
  getConfig,
} from "./i18n/i18n.js";

// Remote function for language switching
export { changeLanguage } from "./i18n/i18n.remote.js";

// Type exports
export type { Cookies } from "@sveltejs/kit";
export type { ParagoneConfig } from "./i18n/i18n.js";
