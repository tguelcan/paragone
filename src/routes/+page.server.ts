import type { PageServerLoad } from "./$types.js";
import { I18n } from "$lib/index.js";
import locale from "./locale.ts";

export const load: PageServerLoad = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);

  return {
    title: t("demo.title"),
    language: locals.language,
  };
};
