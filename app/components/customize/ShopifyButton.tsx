// MyButton.tsx
import {extendVariants, Button} from "@nextui-org/react";

export const ShopifyButton = extendVariants(Button, {
    variants: {
        // <- modify/add variants
        color: {
            shopifyPrimary: "text-white bg-[#008060]",
        },
        isDisabled: {
            true: "bg-[#008060] text-[#b5b5b5] cursor-not-allowed",
        },
    },
    defaultVariants: { // <- modify/add default variants
        color: "shopifyPrimary",
        size: "md",
    },
    compoundVariants: [ // <- modify/add compound variants
        {
            isDisabled: true,
            color: "shopifyPrimary",
            class: "bg-[#84cc16]/80 opacity-100",
        },
    ],
});
