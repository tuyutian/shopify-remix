import pino from "pino"
import { getServerEnv } from "~/env.server"
const env = getServerEnv()
const logger = pino({
	level: env.NODE_ENV === "production" ? "error" : "debug",
	transport: env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
})

export default logger
