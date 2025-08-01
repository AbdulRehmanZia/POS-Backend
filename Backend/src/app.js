import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import cors from "cors"
import { fileLogger,consoleLogger,errorLogger   } from "./middleware/logger.js"
import { apiLimiter } from "./middleware/rateLimiter.js"
import helmet from "helmet"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(helmet())
app.use(express.json({limit: "20kb"}))
app.use(apiLimiter)
app.use(urlencoded({limit: "20kb", extended: true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(fileLogger)
app.use(errorLogger)
app.use(consoleLogger)

// arcjet

export default app