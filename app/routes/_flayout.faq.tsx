import SearchInput from "~/components/front/SearchInput";
import '~/assets/styles/faq.css';
import {Outlet} from "@remix-run/react";

export interface FaqListByCategories {
  id: number;
  cate_id: number;
  title: string;
  popularity: number;
}

export interface CategoriesPageData {
  id: number;
  category_name: string;
  faqs: FaqListByCategories[]
}
export interface FaqMenuList {
  id: number;
  cate_id: number;
  title: string;
}

export interface CategoryMenu {
  id: number;
  category_name: string;
  faq: FaqMenuList[]
}


export default function Faq() {
  return <div>
    <SearchInput />
    <div className="max-w-[1200px] contianer mx-auto mt-3">
      <Outlet />
    </div>
  </div>;
}
