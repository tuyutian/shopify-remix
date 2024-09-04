import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("keyword");
  if (search && search.length > 0) {
    const strReplace = function (
      searchArray: string[],
      replaceArray: string[],
      str: string,
    ) {
      if (searchArray.length !== replaceArray.length)
        throw new Error("Arrays must be of the same length");
      return searchArray.reduce(
        (acc, search, i) =>
          acc.replace(new RegExp(search, "g"), replaceArray[i]),
        str,
      );
    };
    const searchArray = ["&", '"', "%", "<", ">", "_"];
    const replaceArray = ["&amp;", "&quot;", "", "&lt;", "&gt;", ""];
    const result = strReplace(searchArray, replaceArray, search);
    console.log(result);
    const searchContent = await prisma.faqs.findMany({
        where: {
          show: {
            equals: 1
          },
          content: {
            contains: result,
          },
        },
      orderBy:{
          popularity:"desc"
      },
      select: {
        title: true,
        cate_id: true,
        content: true,
        faq_category: {
          select: {
            id: true,
          },
        },
      },
    });
    console.log(searchContent);
  }
  return json({ list: [], code: 200 });
};
