import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["es", "ca", "en"],

  // Used when no locale matches
  defaultLocale: "es",
});
