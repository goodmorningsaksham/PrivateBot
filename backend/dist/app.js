import express from 'express';
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
//cors
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // so we can parse JSON data or send JSON data
app.use(cookieParser(process.env.COOKIE_SECRET)); // so we can parse cookies
// remove it in production
app.use(morgan("dev")); // so we can see the requests in the console
app.use("/api/v1", appRouter);
export default app;
//# sourceMappingURL=app.js.map