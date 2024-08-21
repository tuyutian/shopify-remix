import {
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@nextui-org/react";
import {Outlet, useLocation} from "@remix-run/react";
import {Link} from "@nextui-org/link";
import TMLOGO from "~/assets/images/tm_logo.png";
import {ShopifyButton} from "~/components/customize/ShopifyButton";
import React, {useCallback, useState} from "react";
import {ShopifyIcon} from "~/components/icons/ShopifyIcon";

export default function FLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuItems = [
    {
      title: "Help center",
      link:"/faq",
      target:"_self"
    },
    {
      title: "Feedback",
      link:"/feedback",
      target:"_self"
    },
    {
      title: "About us",
      link:"https://www.trackingmore.com/about-us",
      target:"_blank"
    }
  ];
  const isCurrentPath = useCallback(function (path:string){
    const pathname = location.pathname;
    return pathname.startsWith(path)
  },[location.pathname])
  const Year = new Date().getFullYear()
  return <div>
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="https://tms.trackingmore.net" className=" h-full flex">
            <img
              className="md:h-8 sm:h-4"
              src={TMLOGO}
              alt="Trackingmore logo" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => {
          const isCurrent = isCurrentPath(item.link);
          return <NavbarItem isActive={isCurrent} key={index}>
            <Link target={item.target} color={isCurrent ? "primary" : "foreground"}
                  aria-current={isCurrent ? "page" : undefined} href={item.link}>
              {item.title}
            </Link>
          </NavbarItem>
        })}

      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ShopifyButton
            as={Link}
            target="_blank"
            startContent={<ShopifyIcon fill="white"  />}
            color="shopifyPrimary"
            href="https://apps.shopify.com/trackingmore"
            className="text-sm "
          >
            Install on Shopify
          </ShopifyButton>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => {
          const isCurrent = isCurrentPath(item.link);
          return <NavbarMenuItem key={`${item.link}-${index}`}>
            <Link
              target={item.target} color={isCurrent ? "primary" : "foreground"}
              aria-current={isCurrent ? "page" : undefined} href={item.link}
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        })}
      </NavbarMenu>
    </Navbar>
    <div className="block relative min-h-[calc(100vh_-_64px_-_85px)]">
      <Outlet />
    </div>
    <footer className="container mx-auto max-w-7xl pb-6 px-12">
      <Divider className="my-4" />
      <div
        className="flex flex-col justify-center items-center gap-1 text-sm text-default-400"
      >
        ©2014-{Year} TrackingMore. All Rights Reserved.
      </div>
    </footer>
  </div>;
}
