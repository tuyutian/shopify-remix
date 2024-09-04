import {ReactNode, useEffect, useState} from "react";
import {ViewportContext} from "@/contexts/ViewportContext";

const ViewportProvider = ({children}:{ children: ReactNode })=>{

    // 顺带监听下高度，备用
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] =useState(window.innerHeight);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <ViewportContext.Provider value={{ width, height }}>
            {children}
        </ViewportContext.Provider>
    );
}

export {ViewportProvider}
