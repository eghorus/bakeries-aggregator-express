import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitizeMongoQuery from "./middlewares/sanitize-mongo-queries";
import userRouter from "./routers/user.router";
import bakeryRouter from "./routers/bakery.router";
import orderRouter from "./routers/order.router";
import OpError from "./lib/operational-error";
import globalErrorHandler from "./middlewares/global-error-handler";

const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: "Too many requests made from this IP address, please try again after one hour.",
  standardHeaders: true,
});
app.use(cors({ origin: process.env.CLIENT_HOST }));
app.options("*", cors());
app.use("/api", limiter);
app.use(express.json({ limit: "2mb" }));
app.use(sanitizeMongoQuery);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bakeries", bakeryRouter);
app.use("/api/v1/orders", orderRouter);
app.use((req, res, next) => next(new OpError(404, `Can't ${req.method} on ${req.originalUrl}.`)));
app.use(globalErrorHandler);

export default app;
