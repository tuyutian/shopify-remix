import {Links, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";
import stylesheet from "tailwindcss/tailwind.css?url";
import type {LinksFunction} from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export default function App() {
  return (
    <html>
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
    </NextUIProvider>
    </body>
    </html>
  );
}
