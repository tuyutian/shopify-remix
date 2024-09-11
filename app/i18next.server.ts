import HttpApi from "i18next-http-backend";
import { RemixI18Next } from "remix-i18next/server";
import config from "~/lib/i18n"; // your i18n configuration file

let i18next = new RemixI18Next({
  detection: {
    supportedLanguages: config.supportedLngs as string[],
    fallbackLanguage: config.fallbackLng as string,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...config,
    backend: {
      loadPath: `${process.env.VITE_API_BASE_URL}/v1/lang/{{lng}}`,
      addPath: `${process.env.VITE_API_BASE_URL}/v1/lang/{{lng}}`,
      parse: function (res:any) {
        if (res.data&&res.data.length>0){
          console.log(res.data.data[res.data.lang].translation);
          return res.data.data[res.data.lang].translation;

        }
        return [];
      },
    },
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [HttpApi],
});

export default i18next;
