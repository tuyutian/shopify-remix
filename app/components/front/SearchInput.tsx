import { useEffect, useState } from "react";
import {
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
} from "@nextui-org/react";
import { useNavigate } from "react-router";
import { useViewport } from "~/hooks/viewport.hook";
import useDebounce from "~/hooks/debounce.hook";
import FaqService from "~/services/faqService";

type searchResult = {
  id: number;
  cate_id: number;
  title: string;
};
export default function SearchInput() {
  const { width } = useViewport();
  const navigate = useNavigate();
  const [resultList, setResultList] = useState<searchResult[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchText, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      FaqService.search(debouncedSearchTerm).then((res) => {
        if (res.code === 200) {
          setResultList(res.data.list);
        }
      });
    } else {
      setResultList([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ backgroundColor: "#FF5924" }}>
      <div
        className={
          width <= 728
            ? "help-banner-box h-[143px] pl-5 pr-5 pt-7"
            : "help-banner-box h-[300px] pl-5 pr-5 pt-7 flex flex-col items-center"
        }
      >
        <p
          className={
            width <= 728
              ? "help-banner-title text-center text-2xl font-medium"
              : "help-banner-title text-center text-5xl font-medium mt-[48px]"
          }
        >
          How can we help you?
        </p>
        <div
          className={
            width <= 728 ? "mt-3 relative" : "mt-12 w-[600px] relative"
          }
        >
          <Input
            label=""
            placeholder="Search in help articles"
            radius="sm"
            size={width <= 728 ? "md" : "lg"}
            isClearable
            className="w-full"
            startContent={<div className="help-search-icon" />}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            onClear={() => {
              setSearchText("");
            }}
          />
          <Popover
            placement="bottom"
            isOpen={resultList.length > 0 || searchText.length > 0}
            size="lg"
            classNames={{ base: "w-full" }}
            style={{
              width: width <= 728 ? width - 40 : 600,
              opacity: resultList.length > 0 || searchText.length > 0 ? 1 : 0,
              display:
                resultList.length > 0 || searchText.length > 0
                  ? "block"
                  : "none",
            }}
            offset={-16}
            className="absolute top-2"
          >
            {[
              <PopoverContent key="">
                <Listbox
                  aria-label="Actions"
                  items={resultList}
                  emptyContent={
                    <div className="text-center">
                      No Result，please enter other key word
                    </div>
                  }
                >
                  {(item) => (
                    <ListboxItem
                      key={item.id}
                      color="primary"
                      onClick={() => {
                        setSearchText("");
                        setResultList([]);
                        navigate(`/faq/cate/${item.cate_id}/${item.id}`);
                      }}
                    >
                      {item.title}
                    </ListboxItem>
                  )}
                </Listbox>
              </PopoverContent>,
            ]}
          </Popover>
        </div>
      </div>
    </div>
  );
}
