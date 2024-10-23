import { InitOptions } from "i18next";

const i18nConfig =  {
  // This is the list of languages your application supports
  supportedLngs: ["en", "es",'de','cn','it','fr'],
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: "en",
  load: 'languageOnly',
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: false,
  debug: false,
  interpolation: { escapeValue: false },
  // Disable suspense mode. (Recommended).
  react: { useSuspense: false },
} satisfies InitOptions

export default i18nConfig
