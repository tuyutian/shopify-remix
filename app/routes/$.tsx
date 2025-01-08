import { type MetaFunction, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Icon } from "~/library/icon/Icon"
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
	]
}
function Page404() {
	const navigate = useNavigate()

	return (
		<div className="container mx-auto">
			<div className="h-[80vh] items-center grid gap-x-5 ">
				<div className="flex flex-row flex-nowrap gap-4 items-center justify-center">
					<div>
						<Icon name="404" size="unlimited" fill="none" />
					</div>
					<div className="flex flex-col gap-6">
						<div className="text-xl">There&#39;s no page at this address</div>
						<div className="text-lg">Check the URL and try again, or contact us to get what you need.</div>
						<Button variant="link" onClick={() => navigate("/")}>
							Return to home
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page404
