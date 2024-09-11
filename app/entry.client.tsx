import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import i18n from "@/lib/i18n";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import HTTPApi from "i18next-http-backend";
import { getInitialNamespaces } from "remix-i18next/client";

async function hydrate() {
  await i18next
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(HTTPApi) // Set up our backend
    .init({
      ...i18n, // spread the configuration
      ns: getInitialNamespaces(),
      backend: {
        loadPath: `${import.meta.env.VITE_API_BASE_URL}/v1/lang/{{lng}}`,
        addPath: `${import.meta.env.VITE_API_BASE_URL}/v1/lang/{{lng}}`,
        parse: function (res:any) {
          if (res.data&&res.data.length>0){
            console.log(res.data.data[res.data.lang].translation);
            return res.data.data[res.data.lang].translation;

          }
          return [];
        },
      },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ["htmlTag"],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    });


  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
