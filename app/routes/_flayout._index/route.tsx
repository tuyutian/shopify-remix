import type {LoaderFunctionArgs} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, MetaFunction, useLoaderData, useSubmit} from "@remix-run/react";

import {login} from "~/shopify.server";
import {useCallback, useState} from "react";
import {Button, Input} from "@nextui-org/react";
import {SubmitTarget} from "react-router-dom/dist/dom";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({showForm: Boolean(login)});
};
export const meta: MetaFunction = () => {
  return [
    { title: "TrackingMore order tracking" },
    {
      property: "og:title",
      content: "TrackingMore order tracking",
    },
    {
      name: "description",
      content: "TrackingMore login",
    },
  ];
};
export default function App() {
  const {showForm} = useLoaderData<typeof loader>();
  const [shopName, setShopName] = useState("");
  const submit = useSubmit();

  const [error, setError] = useState(false);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (shopName.length > 0) {
      submit(e.target as SubmitTarget);
    } else {
      setError(true);
    }
  }, [shopName]);
  return <div className="mx-auto container  w-full ">
    <div className="pt-36 text-center">
      <h1
        className=" text-2xl lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl font-semibold leading-normal">Tracking<span
        style={{color: "rgb(232, 119, 78)"}}>More</span> for <span
        style={{color: "rgba(41, 132, 90, 1)"}}>Shopify</span></h1>
      <p className="text-xl mt-12">Enter your Shopify domain to login.</p>
      {showForm &&
        <Form onSubmit={handleSubmit} className="flex flex-row justify-center flex-wrap gap-4 m-auto pt-5" method="post"
              action="/auth/login">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex flex-row justify-center">
              <Input
                name="shop"
                id="shop"
                label="Shop name"
                isRequired
                size="sm"
                variant="bordered"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                autoComplete="off"
              />
              <span
                className="flex select-none items-center md:text-xl pl-1 text-gray-500 sm:text-sm">.myshopify.com</span>
            </div>
            {shopName.length <= 0 && error ? <div className="text-red-600 pl-1">
              Please input shop name
            </div> : ""}
          </div>
          <Button color="primary" type="submit"
          >Login
          </Button>
        </Form>}
    </div>
  </div>;
}
