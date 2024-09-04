import { FaqCategoryContext } from "@/contexts/FaqCategoryContext";
import { useContext } from "react";

const useFaqCategory = () => {
    const { categoryList, setCategoryList } = useContext(FaqCategoryContext);
    return { categoryList, setCategoryList };
}

export {useFaqCategory}
