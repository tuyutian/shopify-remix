import { ViewportContext } from "@/contexts/ViewportContext";
import { useContext } from "react";

const useViewport = () => {
    const { width, height } = useContext(ViewportContext);
    return { width, height };
}

export {useViewport}
