import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu, useAppBridge } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "~/shopify.server";
import AppService from "~/services/appService";
import type { UserOther } from "~/types/api";
import { useEffect } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

function loadJs(srcUrl: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = srcUrl;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    };
    script.onerror = (err) => {
      reject(err);
    };
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const res: any = await AppService.getOthers(
    request.headers.get("authorization")?.replace("Bearer ", ""),
  );
  const data: UserOther = res.data;
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", data: data });
};

export default function App() {
  const { apiKey, data } = useLoaderData<typeof loader>();
  const appBridge = useAppBridge();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = data.email;
      const name = data.name;
      // @ts-expect-error crisp set
      window.CRISP_TOKEN_ID = data.token_id;
      // @ts-expect-error crisp set
      const crisp = window.$crisp;
      crisp.push(["do", "session:reset"]);
      crisp.push(["set", "user:email", [email]]);
      crisp.push(["set", "user:nickname", [name]]);
      if (data.session_data) {
        crisp.push(["set", "session:data", [data.session_data]]);
      }
      const nps = data.nps;
      if (nps.npsSwitch) {
        setTimeout(() => {
          try {
            loadJs(
              `https://survey.channelwill.com/nps-entrance.umd.js?v=${new Date().getTime()}`,
            )
              .then(() => {
                // @ts-expect-error nps set
                window.NPS.boot({
                  accessType: "SPFAPP",
                  accessToken: nps.token,
                  accessTime: nps.accessTime,
                  shop: appBridge.config.shop,
                  planDisplayName: nps.planDisplayName,
                  days: nps.days,
                  installTime: nps.installTime,
                  language: appBridge.config.locale,
                  attribute: "In-product.Pop-up.Dashboard",
                  lastTime: nps.lastTime,
                  // 样式可以写在这里
                  style: {},
                });
              })
              .catch((e) => {
                if (typeof e === "string") {
                  console.log(e.toUpperCase()); // works, `e` narrowed to string
                } else if (e instanceof Error) {
                  console.log(e.message); // works, `e` narrowed to Error
                }
              });
          } catch (e) {
            console.log(e);
          }
        }, 3000);
      }
    }
  }, []);
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
