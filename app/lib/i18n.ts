import type { InitOptions } from "i18next";

const i18nConfig:Omit<InitOptions, "react" | "detection"> =  {
  // This is the list of languages your application supports
  supportedLngs: ["en", "es",'de','cn','it','fr'],
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: "en",
  load: 'languageOnly',
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: "common",
  debug: process.env.NODE_ENV !== 'production',
};

export default i18nConfig
