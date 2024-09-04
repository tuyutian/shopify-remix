import {Outlet, useNavigate, useOutletContext, useParams} from "@remix-run/react";
import { useViewport } from "~/hooks/viewport.hook";
import React, { useCallback, useState } from "react";
import { Link } from "@nextui-org/link";
import { Card, CardBody, Skeleton, Tab, Tabs } from "@nextui-org/react";
import type { CategoriesPageData } from "../_flayout.faq";

export default function FaqCategory() {
  const categoryList:CategoriesPageData[] = useOutletContext();
  const { width } = useViewport();
  const navigate = useNavigate();
  const params = useParams();
  const cateId = params.cateId;
  const id = params.id;
  const [selectCategory, setSelectCategory] = useState<CategoriesPageData|undefined>(categoryList.find(value=>{return cateId && value.id === Number(cateId)}));

  const handleSelectCategory = useCallback(
    (id: number) => {
      categoryList.map((value: CategoriesPageData) => {
        if (value.id === Number(id)) {
          setSelectCategory(value);
        }
        return value.id === Number(id);
      });
    },
    [categoryList],
  );
  return categoryList.length > 0 ? (
    width <= 728 ? (
      <div className="flex flex-col gap-4 px-4 pb-3">
        <div style={{ color: "#616161" }}>
          <Link
            size="sm"
            underline="hover"
            color="foreground"
            className="text-base cursor-pointer underline-offset-0"
            style={{ color: "#616161" }}
            href="/faq"
          >
            Help center
          </Link>{" "}
          /{" "}
          <span style={{ color: "#303030" }}>
            {selectCategory?.category_name}
          </span>
        </div>
        {selectCategory?.faqs && selectCategory?.faqs.length > 0 ? (
          selectCategory?.faqs.map((value) => {
            return (
              <div key={value.id} className={width <= 728 ? "" : "w-1/3 px-2"}>
                <Card
                  radius={width <= 728 ? "sm" : "none"}
                  fullWidth
                  isPressable
                  disableRipple
                  onClick={() => {
                    navigate(`/faq/cate/${value.cate_id}/${value.id}`);
                  }}
                >
                  <CardBody className={width <= 728 ? "py-2" : "py-4"}>
                    <div className="flex items-center justify-between">
                      <div
                        className={
                          width <= 728
                            ? "font-normal text-base w-11/12"
                            : "text-sm"
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
          })
        ) : (
          <div className="text-sm text-default-400">
            No articles have been published yet.
          </div>
        )}
      </div>
    ) : (
      <Tabs
        aria-label="Options"
        isVertical
        radius="none"
        classNames={{
          tabList: "bg-default-0 max-w-[220px] mr-5",
          tabContent:
            "py-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-[600] group-data-[selected=true]:text-white",
          cursor: "bg-[#FF5924]",
          panel: "border-l-3 border-inherit",
        }}
        defaultSelectedKey={cateId}
        onSelectionChange={(key) => {
          handleSelectCategory(Number(key));
          navigate(`/faq/cate/${key}`, {
            replace: true,
          });
        }}
      >
        { (
          categoryList.map((value) => {
            return (
              <Tab
                key={value.id}
                title={value.category_name}
                className="w-full pl-5"
              >
                {id && selectCategory ? (
                <Outlet context={{ category: selectCategory }} />
                ) :<div>
                <div style={{ color: "#303030" }} className="mb-5">
                  <Link
                    size="sm"
                    underline="hover"
                    color="foreground"
                    className="text-base cursor-pointer underline-offset-0"
                    style={{ color: "#616161" }}
                    href="/faq"
                  >
                    Help center
                  </Link>{" "}
                  / {value.category_name}
                </div>
                <div className="flex flex-col gap-y-5">
                  {value.faqs && value.faqs.length > 0 ? (
                    value.faqs.map((item) => {
                      const popularity =
                        Math.floor(item.popularity / 10) + 1 > 6
                          ? 6
                          : Math.floor(item.popularity / 10) + 1;
                      return (
                        <Card
                          shadow="sm"
                          radius={width <= 728 ? "sm" : "none"}
                          fullWidth
                          isPressable
                          disableRipple
                          onClick={() => {
                            navigate(`/faq/cate/${item.cate_id}/${item.id}`);
                          }}
                          key={item.id}
                        >
                          <CardBody className="py-2.5 px-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm">{item.title}</div>
                              <div
                                className={`hot-level-icon hot-level${popularity}`}
                              />
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-sm text-default-400">
                      No articles have been published yet.
                    </div>
                  )}
                </div></div>}
              </Tab>
            );
          })
        )}
      </Tabs>
    )
  ) : width <= 728 ? (
    <div className="flex flex-col w-full gap-5 px-3">
      <Skeleton className="w-1/5 h-3 rounded-lg" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton className="w-full h-3 rounded-lg" key={i} />
      ))}
    </div>
  ) : (
    <div className="flex w-full">
      <div className="max-w-[200px] flex flex-col w-full gap-8 items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-3/5 h-3 rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col w-full gap-8 pl-5 border-l-3 border-inherit">
        <Skeleton className="w-1/5 h-3 rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton className="w-full h-3 rounded-lg" key={i} />
        ))}
      </div>
    </div>
  );
}
