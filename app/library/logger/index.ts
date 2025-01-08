import pino from "pino"
import { initEnv } from "~/env.server"
const env = initEnv()
const logger = pino({
	level: env.NODE_ENV === "production" ? "error" : "debug",
	transport: env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
})

export default logger
