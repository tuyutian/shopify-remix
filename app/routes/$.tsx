import {Link,  } from "@nextui-org/link";
import type {MetaFunction} from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "The page is not found" },
    {
      property: "og:title",
      content: "The page is not found",
    },
    {
      name: "description",
      content: "TrackingMore The page is not found",
    },
  ];
};
function Page404() {
  return (
    <div className="container mx-auto">
      <div className="h-[80vh] items-center grid gap-x-5 ">
        <div className="flex flex-row flex-nowrap gap-4 items-center justify-center" >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" fill="none">
              <path fill="#F0F1F2"
                    d="M240 120c0 66.324-53.676 120-120 120S0 186.324 0 120 53.676 0 120 0s120 53.838 120 120Z" />
              <g filter="url(#a)">
                <path fill="#fff" d="M224 40H16a4 4 0 0 0-4 4v150a4 4 0 0 0 4 4h208a4 4 0 0 0 4-4V44a4 4 0 0 0-4-4Z" />
                <path fill="#F0F1F2"
                      d="M214 72H74a2 2 0 0 0-2 2v110a2 2 0 0 0 2 2h140a2 2 0 0 0 2-2V74a2 2 0 0 0-2-2Z" />
                <path fill="#B6BABF" d="M114 52H76a4 4 0 0 0 0 8h38a4 4 0 0 0 0-8Z" />
                <path fill="#00735C" d="M60 40H16a4 4 0 0 0-4 4v150a4 4 0 0 0 4 4h44V40Z" />
                <path stroke="#00996E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M22 58.66c2.057 0 2.171-2.66 4.571-2.66 2.458 0 2.458 3 4.858 3 2.4 0 2.514-2.66 4.8-2.66 2.285 0 2.228 2.66 4.571 2.66 2.343 0 2.514-2.66 4.743-2.66C47.77 56.34 48.57 59 50 59" />
                <path fill="#9FA5AB"
                      d="M116.187 145.431h6.47v-6.035h4.284v-5.488h-4.284v-21.339h-9.604L100 133.657v5.739h16.187v6.035Zm-10.258-11.341v-.182l10.236-16.374h.157v16.556h-10.393ZM143.286 146c8.251 0 13.256-6.536 13.256-16.989v-.045c0-10.453-5.005-16.966-13.256-16.966-8.252 0-13.256 6.513-13.256 16.966v.045c0 10.453 5.004 16.989 13.256 16.989Zm0-5.511c-4.058 0-6.38-4.259-6.38-11.478v-.045c0-7.219 2.322-11.455 6.38-11.455s6.38 4.236 6.38 11.455v.045c0 7.219-2.322 11.478-6.38 11.478Zm32.96 4.942h6.471v-6.035H187v-5.488h-4.283v-21.339h-9.605l-13.053 21.088v5.739h16.187v6.035Zm-10.258-11.341v-.182l10.236-16.374h.157v16.556h-10.393Z" />
              </g>
              <defs>
                <filter id="a" width="236" height="178" x="2" y="32" colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha"
                                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="5" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
                  <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_4583_87836" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_4583_87836" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col gap-6">
            <div className="text-xl">
              There's no page at this address
            </div>
            <div className="text-lg">
              Check the URL and try again, or contact us to get what you need.
            </div>
            <Link href="/" >Return to home</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page404
