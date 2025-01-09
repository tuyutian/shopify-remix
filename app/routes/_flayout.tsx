import TMLOGO from "@/assets/images/tm_logo.png"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Divider } from "@shopify/polaris"
import { MenuIcon } from "@shopify/polaris-icons"
import type { Target } from "@shopify/polaris/build/ts/src/types"
import { useCallback } from "react"
import { Link, Outlet, useLocation } from "react-router"
import { Button } from "~/components/ui/button"
import { Icon } from "~/library/icon/Icon"

export default function FLayout() {
	const location = useLocation()
	const menuItems = [
		{
			title: "Help center",
			link: "/faq",
			target: "_self",
		},
		{
			title: "Feedback",
			link: "/feedback",
			target: "_self",
		},
		{
			title: "About us",
			link: "https://www.trackingmore.com/about-us",
			target: "_blank",
		},
	]
	const isCurrentPath = useCallback(
		(path: string) => {
			const pathname = location.pathname
			return pathname.startsWith(path)
		},
		[location.pathname]
	)
	const Year = new Date().getFullYear()
	return (
		<div>
			<header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
				<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
					<div className="flex flex-nowrap items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="rounded-full md:hidden">
									<MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									<span className="sr-only">Toggle navigation menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="md:hidden">
								<div className="grid gap-4 p-4">
									{menuItems.map((item) => {
										const isCurrent = isCurrentPath(item.link)
										return (
											<Link
												key={item.link}
												target={item.target as Target}
												className={` text-sm font-medium hover:text-gray-900  dark:hover:text-gray-50 ${isCurrent ? "text-gray-500 dark:text-gray-400 " : "text-gray-700 dark:text-gray-300 "}`}
												color={isCurrent ? "primary" : "foreground"}
												aria-current={isCurrent ? "page" : undefined}
												to={item.link}
											>
												{item.title}
											</Link>
										)
									})}
								</div>
							</SheetContent>
						</Sheet>
						<Link to="/" className="flex items-center gap-2">
							<img className="md:h-8 sm:h-4 " src={TMLOGO} alt="Trackingmore logo" />
							<span className="sr-only">TrackingMore Inc</span>
						</Link>
					</div>
					<nav className="hidden items-center gap-6 text-sm font-medium md:flex">
						{menuItems.map((item) => {
							const isCurrent = isCurrentPath(item.link)
							return (
								<Link
									key={item.link}
									target={item.target as Target}
									className={` hover:text-gray-900  dark:hover:text-gray-50 ${isCurrent ? "text-gray-500 dark:text-gray-400 " : "text-gray-700 dark:text-gray-300 "}`}
									color={isCurrent ? "primary" : "foreground"}
									aria-current={isCurrent ? "page" : undefined}
									to={item.link}
								>
									{item.title}
								</Link>
							)
						})}
					</nav>
					<div className="flex items-center gap-4">
						<div className=" items-center gap-2 text-sm font-medium md:flex">
							<Button
								className="bg-[#008060] hover:bg-[#339980]"
								onClick={() => open("https://apps.shopify.com/trackingmore", "_blank")}
							>
								<Icon name="Shopify" color="white" size="sm" />
								Install on Shopify
							</Button>
						</div>
					</div>
				</div>
			</header>
			<div className="block relative min-h-[calc(100vh_-_64px_-_85px)]">
				<Outlet />
			</div>
			<footer className="container mx-auto max-w-7xl pb-6 px-12">
				<Divider />
				<div className="flex flex-col justify-center items-center gap-1 text-sm text-default-400">
					©2014-{Year} TrackingMore. All Rights Reserved.
				</div>
			</footer>
		</div>
	)
}
