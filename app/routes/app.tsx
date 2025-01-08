import { NavMenu } from "@shopify/app-bridge-react"
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url"
import { AppProvider } from "@shopify/shopify-app-remix/react"
import { boundary } from "@shopify/shopify-app-remix/server"
import { type HeadersFunction, Link, type LoaderFunctionArgs, Outlet, useLoaderData, useRouteError } from "react-router"

import { initEnv } from "~/env.server"
import { authenticate } from "~/server/shopify"

export const links = () => [{ rel: "stylesheet", href: polarisStyles }]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await authenticate.admin(request)
	const env = initEnv()
	return { apiKey: env.SHOPIFY_API_KEY || "" }
}

export default function App() {
	const { apiKey } = useLoaderData<typeof loader>()

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<NavMenu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/additional">Additional page</Link>
			</NavMenu>
			<Outlet />
		</AppProvider>
	)
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
	return boundary.error(useRouteError())
}

export const headers: HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs)
}
