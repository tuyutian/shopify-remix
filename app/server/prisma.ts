import type { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { getServerEnv } from "~/env.server"
import logger from "~/server/logger"

const prismaGlobal = globalThis as unknown as {
	prisma?: PrismaClient
}
const config: Prisma.PrismaClientOptions = {
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "stdout",
			level: "error",
		},
		{
			emit: "stdout",
			level: "info",
		},
		{
			emit: "stdout",
			level: "warn",
		},
	],
}

const prisma: PrismaClient = prismaGlobal.prisma || new PrismaClient(config)
const env = getServerEnv()
if (env.NODE_ENV !== "production") {
	if (!prismaGlobal.prisma) {
		prismaGlobal.prisma = new PrismaClient(config)
	}
}

// @ts-expect-error prisma log query
prisma.$on("query", (e: Prisma.QueryEvent) => {
	logger.debug(`Query: ${e.query}`)
	logger.debug(`Params: ${e.params}`)
	logger.debug(`Duration: ${e.duration}ms`)
})

export default prisma
