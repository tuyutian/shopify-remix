import "@shopify/shopify-app-remix/adapters/node"
import { PrismaSessionStorage } from "@/session/PrismaSessionStorage"
import { ApiVersion, AppDistribution, shopifyApp } from "@shopify/shopify-app-remix/server"
import { getServerEnv } from "~/env.server"
import prisma from "./prisma"

const env = getServerEnv()

const shopify = shopifyApp({
	apiKey: env.SHOPIFY_API_KEY,
	apiSecretKey: env.SHOPIFY_API_SECRET || "",
	apiVersion: ApiVersion.October24,
	scopes: env.SCOPES?.split(","),
	appUrl: env.SHOPIFY_APP_URL || "",
	authPathPrefix: "/auth",
	sessionStorage: new PrismaSessionStorage(prisma),
	distribution: AppDistribution.AppStore,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
		removeRest: true,
	},
	...(env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [env.SHOP_CUSTOM_DOMAIN] } : {}),
})

export default shopify
export const apiVersion: ApiVersion = ApiVersion.October24
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders
export const authenticate = shopify.authenticate
export const unauthenticated = shopify.unauthenticated
export const login = shopify.login
export const sessionStorage = shopify.sessionStorage
