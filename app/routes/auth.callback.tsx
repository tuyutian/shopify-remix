import {redirect, type LoaderFunctionArgs } from "@remix-run/node";
import appService from "~/services/appService";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  const data = await appService.callback(url.searchParams);
  console.log(data);
  if (data.code === 200) {
    throw redirect(decodeURIComponent(data.data.redirect_uri));
  } else if (shop) {
    throw redirect(`https://tms.trackingmore.net/?shop=${shop}`);
  }
  return null;
};
