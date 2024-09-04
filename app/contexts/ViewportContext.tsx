import {createContext} from "react";

type ViewContext = {
    height:number,
    width:number
}
const ViewportContext = createContext<ViewContext>({height:1200,width:1000})

export {ViewportContext}
