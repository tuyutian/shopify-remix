import { type LoaderFunctionArgs } from "@remix-run/node";
import prisma from "@/db.server"

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const lang = params.lang;
  const translations = await prisma.translations.findMany({
    where: { lang }
  });
  return translations.reduce((acc:Record<string, string>, translation) => {
      acc[translation.code] = translation.value;
      return acc;
    }, {});
};
