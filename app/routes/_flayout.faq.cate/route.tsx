import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import React from "react";
import prisma from "~/db.server";

export async function loader() {
  const categories = await prisma.faq_categories.findMany({
    select: {
      id: true,
      category_name: true,
      faqs: {
        where: {
          show: {
            equals: 1,
          },
        },
        orderBy: {
          order: "asc",
        },
        select: {
          title: true,
          cate_id: true,
          id: true,
          popularity: true,
          order: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return json(categories ?? []);
}

export default function FaqCategory() {
  const categoryList = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full">
      <Outlet context={categoryList} />
    </div>
  );
}
