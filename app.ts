import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitizeMongoQuery from "./middlewares/sanitize-mongo-queries";
import userRouter from "./routers/user.router";

const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: "Too many requests made from this IP address, please try again after one hour.",
  standardHeaders: true,
});
app.use("/api", limiter);
app.use(express.json({ limit: "2mb" }));
app.use(sanitizeMongoQuery);
app.use("/api/v1/users", userRouter);

export default app;
