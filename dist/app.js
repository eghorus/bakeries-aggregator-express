"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const sanitize_mongo_queries_1 = __importDefault(require("./middlewares/sanitize-mongo-queries"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const bakery_router_1 = __importDefault(require("./routers/bakery.router"));
const order_router_1 = __importDefault(require("./routers/order.router"));
const operational_error_1 = __importDefault(require("./lib/operational-error"));
const global_error_handler_1 = __importDefault(require("./middlewares/global-error-handler"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: "Too many requests made from this IP address, please try again after one hour.",
    standardHeaders: true,
});
app.use((0, cors_1.default)({ origin: process.env.CLIENT_HOST }));
app.options("*", (0, cors_1.default)());
app.use("/api", limiter);
app.use(express_1.default.json({ limit: "2mb" }));
app.use(sanitize_mongo_queries_1.default);
app.use("/api/v1/users", user_router_1.default);
app.use("/api/v1/bakeries", bakery_router_1.default);
app.use("/api/v1/orders", order_router_1.default);
app.use((req, res, next) => next(new operational_error_1.default(404, `Can't ${req.method} on ${req.originalUrl}.`)));
app.use(global_error_handler_1.default);
exports.default = app;
