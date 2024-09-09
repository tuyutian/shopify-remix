import { Card, CardBody } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { useNavigate } from "react-router-dom";
import {json} from "@remix-run/node";
import {type MetaFunction, useLoaderData} from "@remix-run/react";
import {useViewport} from "~/hooks/viewport.hook";
import type { FaqMenuList} from "~/routes/_flayout.faq";
import prisma from "~/db.server";
export const meta: MetaFunction = () => {
  return [{ title: "FAQ" }];
};

export interface CateFaqEx {
  id: number;
  faq: { title: string; id: number; cate_id: number }[];
  count: number;
}
export async function loader() {
  const categories = await prisma.faq_categories.findMany({
    orderBy:{
      order:'asc'
    },
  });
  const faqs = await prisma.faqs.findMany({
    where: {
      show: {
        equals: 1
      }
    },
    orderBy:{
      views:'desc'
    },
    select:{
      title:true,
      cate_id:true,
      id:true,
    }
  });
  let faqViews: { title: string; id: number; cate_id: number }[] = [];
  if (faqs.length > 0&&categories.length > 0) {
    faqViews = faqs.slice(0, 8);
  }
  // 结果数组
  let classValue:Record<string, CateFaqEx> = {};
  if (categories.length > 0) {
    categories.forEach(value => {
      const filteredFaq = faqs.filter(faq => faq.cate_id === value.id).slice(0, 2);
      // 计算count
      const count = faqs.filter(faq => faq.cate_id === value.id).length;
      // 构造结果对象
      classValue[value.category_name] = {
        id: value.id,
        faq: filteredFaq,
        count: count
      };
    });
  }
  return json({faq_views:faqViews,categories:classValue});
}
export default function FaqList() {
  const data = useLoaderData<typeof loader>();
  const faqList:FaqMenuList[] = data.faq_views??[];
  const categoriesList = data.categories??[];
  const { width } = useViewport();
  const navigate = useNavigate();
  return  (
    <div>
      <div className={
        width <= 728
          ? "mt-3 text-xl font-medium text-center"
          : "pt-12 pb-2 text-3xl font-[600] text-center"
      }
      >
        Frequently Asked Questions
      </div>
      <div
        className={
          width <= 728
            ? "mx-auto px-4 flex flex-col py-3 gap-4"
            : "max-w-[1232px] mx-auto px-4 flex mt-7 flex-wrap gap-y-4"
        }
      >
        {faqList.map((value, index) => {
          if (width <= 728 && index >= 4) {
            return "";
          }
          return (
            <div
              key={value.id}
              className={width <= 728 ? "" : "w-1/3 px-2"}
            >
              <Card
                radius={width <= 728 ? "sm" : "none"}
                fullWidth
                isPressable
                disableRipple
                onClick={() => {
                  navigate(
                    `/faq/cate/${value.cate_id}/${value.id}`
                  );
                }}
              >
                <CardBody
                  className={width <= 728 ? "py-2" : "py-4"}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={
                        width <= 728
                          ? "font-normal text-base w-11/12"
                          : "text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-11/12 pl-5 py-0.5"
                      }
                    >
                      {value.title}
                    </div>
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.71967 9.53033C0.426777 9.23744 0.426777 8.76256 0.71967 8.46967L4.18934 5L0.71967 1.53033C0.426777 1.23744 0.426777 0.762563 0.71967 0.46967C1.01256 0.176777 1.48744 0.176777 1.78033 0.46967L5.78033 4.46967C6.07322 4.76256 6.07322 5.23744 5.78033 5.53033L1.78033 9.53033C1.48744 9.82322 1.01256 9.82322 0.71967 9.53033Z"
                        fill="#4A4A4A"
                      />
                    </svg>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
      <div className={
        width <= 728
          ? "mt-3 text-xl font-medium text-center"
          : "mt-16 text-3xl font-[600] text-center"
      }>
        Categories
      </div>
      <div
        className={
          width <= 728
            ? "mx-auto px-4 flex flex-col py-3 gap-3"
            : "max-w-[1232px] mx-auto px-4 flex mt-7 flex-wrap gap-y-4"
        }
      >
        {width <= 728
          ? Object.keys(categoriesList).map((key, index) => {
            return (
              <div key={index} className="flex px-4">
                <Link
                  underline="always"
                  color="foreground"
                  className="cursor-pointer"
                  onClick={()=>{navigate(`/faq/cate/${categoriesList[key].id}`)}}
                >
                  {key}
                </Link>
                <div>&nbsp;({categoriesList[key].count})</div>
              </div>
            );
          })
          : Object.keys(categoriesList).map((key, index) => {
            return (
              <div
                key={index}
                className="w-1/3 px-2"
              >
                <Card
                  radius="none"
                  fullWidth
                  isPressable
                  disableRipple
                  onClick={() => {
                    navigate(
                      `/faq/cate/${categoriesList[key].id}`
                    );
                  }}
                >
                  <CardBody className="p-8">
                    <div className="mb-8 text-xl">
                      {key}
                    </div>
                    {categoriesList[key].faq.length !==
                    0 ? (
                      categoriesList[key].faq.map(
                        (value) => {
                          return (
                            <div
                              key={value.id}
                              className="mb-4"
                            >
                              <Link
                                href={`/faq/cate/${value.cate_id}/${value.id}`}
                                underline="always"
                                color="foreground"
                                className="block w-full overflow-hidden text-base underline-offset-0 overflow-ellipsis whitespace-nowrap"
                              >
                                {value.title}
                                {value.title}
                                {value.title}
                                {value.title}
                                {value.title}
                              </Link>
                              {categoriesList[
                                key
                                ].faq.length ===
                              1 ? (
                                <div className="h-10" />
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="h-20">
                        No articles have been
                        published yet
                      </div>
                    )}
                    <Link
                      size="sm"
                      underline="always"
                      color="foreground"
                      className="mt-4 text-sm cursor-pointer underline-offset-0"
                      style={{ color: "#FF5924" }}
                      onClick={()=>{navigate(`/faq/cate/${categoriesList[key].id}`)}}
                    >
                      Show All{">"}
                    </Link>
                  </CardBody>
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
}
