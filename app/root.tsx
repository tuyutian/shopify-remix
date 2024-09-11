import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";
import stylesheet from "tailwindcss/tailwind.css?url";
import appStyle from "@/assets/styles/app.css?url";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = await i18next.getLocale(request);
  return json({ locale });
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: appStyle },
];
export default function App() {
  let { locale } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale}  dir={i18n.dir()}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://cdn.shopify.com/" />
      <link
        rel="stylesheet"
        href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
      />
      <Meta />
      <Links />
    </head>
    <body>
    <NextUIProvider>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <script async src="https://client.crisp.chat/l.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.$crisp=[];
    window.$crisp.push(["set", "session:data", [['B_User_tag', 'TMS']]])
    window.CRISP_WEBSITE_ID="99d33d31-6c5b-4401-b4c8-4b22e91474ca";`,
        }}
      />
    </NextUIProvider>
    </body>
    </html>
  );
}
