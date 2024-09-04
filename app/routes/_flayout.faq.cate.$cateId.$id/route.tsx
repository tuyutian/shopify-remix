import React, { useCallback, useEffect, useState } from "react";
import { Button, Divider, Skeleton } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { useNavigate, useParams } from "react-router-dom";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { CategoriesPageData } from "~/routes/_flayout.faq";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import FaqService from "~/services/faqService";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  const cateId = params.cateId;
  const faq = await prisma.faqs.findFirst({
    where: {
      show: {
        equals: 1,
      },
      id: {
        equals: parseInt(id as string),
      },
      cate_id: {
        equals: parseInt(cateId as string),
      },
    },
    include: {
      faq_category: true,
    },
  });
  return json(faq);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title || "Faq Doc" }];
};

export default function FaqDetail() {
  const contextData: { category: CategoriesPageData } = useOutletContext();
  const category:CategoriesPageData = contextData.category;
  const params = useParams();
  const id = params.id;
  const cateId = params.cateId;
  const navigate = useNavigate();
  const faqDoc = useLoaderData<typeof loader>();
  const [helpful, setHelpful] = useState<boolean>(false);
  const [notHelpful, setNotHelpful] = useState<boolean>(false);
  const [alreadyHelpful, setAlreadyHelpful] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [scale, setScale] = useState(1);
  const handleHelpful = useCallback(
    (helpfulType: string) => {
      setAlreadyHelpful(true);
      const newHelpful = { yes: Number(helpful), no: Number(notHelpful) };
      const keyword = helpfulType === "helpful" ? 1 : -1;
      if (helpfulType === "helpful") {
        setHelpful(!helpful);
        if (!helpful) {
          setNotHelpful(false);
        }
      }
      if (helpfulType === "notHelpful") {
        setNotHelpful(!notHelpful);
        if (!notHelpful) {
          setHelpful(false);
        }
      }
      FaqService.updatePopularity(Number(keyword), Number(id), newHelpful);
    },
    [helpful, notHelpful, id],
  );
  const openModalSrc = (event: any, imageSrc: string) => {
    // 点击展示大图
    if (!imageSrc) return;
    setScale(1);
    event.preventDefault();
    setSelectedImage(imageSrc);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleWheel = (event: { defaultPrevented: any; deltaY: number }) => {
    if (!event.defaultPrevented) {
      const scaleDelta = event.deltaY > 0 ? 0.9 : 1.1;
      setScale((prevScale) => prevScale * scaleDelta);
    }
  };
  useEffect(() => {
    setHelpful(false);
    setNotHelpful(false);
  }, [params.cateId, params.id]);

  return (
    <div>
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
        /{" "}
        <Link
          size="sm"
          underline="hover"
          color="foreground"
          className="text-base cursor-pointer underline-offset-0"
          style={{ color: "#616161" }}
          href={`/faq/cate/${category.id}`}
        >
          {category.category_name}
        </Link>{" "}
        {faqDoc?.title ? `/ ${faqDoc.title}` : ""}
      </div>
      <div className="flex items-center">
        <Link
          size="sm"
          underline="hover"
          color="foreground"
          className="text-base cursor-pointer underline-offset-0"
          style={{ color: "#616161" }}
          onClick={() => {
            navigate(`/faq/cate/${cateId}`);
          }}
        >
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.75 8C21.75 8.67582 21.2021 9.22368 20.5263 9.22368L4.71759 9.22368L9.15535 13.661C9.63325 14.1388 9.63329 14.9136 9.15544 15.3915C8.67758 15.8694 7.90279 15.8695 7.42489 15.3916L0.897916 8.86532C0.668405 8.63583 0.539465 8.32456 0.539465 8C0.539465 7.67544 0.668405 7.36417 0.897916 7.13468L7.42489 0.608365C7.90279 0.13051 8.67758 0.130549 9.15544 0.608452C9.63329 1.08635 9.63325 1.86115 9.15535 2.339L4.71759 6.77631L20.5263 6.77631C21.2021 6.77631 21.75 7.32418 21.75 8Z"
              fill="#4A4A4A"
            />
          </svg>
        </Link>
        {faqDoc?.title ? (
          <div className="ml-2 text-xl font-medium">{faqDoc?.title}</div>
        ) : (
          <Skeleton className="w-1/3 h-3 ml-3 rounded-lg" />
        )}
      </div>
      {faqDoc?.content ? (
        <div
          className="pt-3 break-all"
          dangerouslySetInnerHTML={{
            __html: faqDoc.content,
          }}
          onClick={(event) => {
            openModalSrc(event, (event.target as HTMLImageElement).src);
          }}
        />
      ) : (
        <div className="flex flex-col gap-3 pt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton className="w-full h-3 rounded-lg" key={i} />
          ))}
        </div>
      )}
      <div className="text-sm mt-14">
        <b>Last update:</b> {faqDoc?.updated_at}
      </div>
      <Divider className="mt-8 mb-6" />
      {alreadyHelpful ? (
        <div className="flex flex-col items-center justify-center gap-1">
          <div>Thank you for your feedback!</div>
          <span className="text-2xl">😊</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <div>Was this article helpful?</div>
          <Button
            size="sm"
            color={helpful ? "primary" : "default"}
            variant="solid"
            onClick={() => {
              console.log(123);
              handleHelpful("helpful");
            }}
          >
            yes
          </Button>
          <Button
            size="sm"
            color={notHelpful ? "primary" : "default"}
            variant="solid"
            onClick={() => {
              handleHelpful("notHelpful");
            }}
          >
            no
          </Button>
        </div>
      )}

      <Divider className="my-6" />
      {showModal ? (
        <div
          className="top-0 left-0 w-[100%] h-[100%]"
          style={{
            position: "fixed",
            zIndex: 1070,
            backgroundColor: "#00000080",
            transition: "opacity 500ms",
            overflow: "hidden",
          }}
        >
          <div
            className="relative flex items-center justify-center h-[100%]"
            onClick={closeModal}
          >
            <div
              className="absolute cursor-pointer top-10 right-10"
              style={{ zIndex: 1 }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="rgba(128, 128, 128, 0.5)"
                />
                <line
                  x1="12"
                  y1="12"
                  x2="28"
                  y2="28"
                  stroke="white"
                  stroke-width="2"
                />
                <line
                  x1="28"
                  y1="12"
                  x2="12"
                  y2="28"
                  stroke="white"
                  stroke-width="2"
                />
              </svg>
            </div>
            <img
              className="absolute max-w-[90vw] max-h-[90vh] object-contain"
              onWheel={handleWheel}
              style={{ transform: `scale(${scale})` }}
              src={selectedImage}
              onClick={(e) => e.stopPropagation}
              alt="content"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
