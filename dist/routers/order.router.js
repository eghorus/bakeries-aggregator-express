"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_authentication_1 = __importDefault(require("../middlewares/check-authentication"));
const order_controllers_1 = require("../controllers/order.controllers");
const router = express_1.default.Router();
router.use(check_authentication_1.default);
router.route("/").post(order_controllers_1.createOrder);
router.route("/:orderId").patch(order_controllers_1.completeOrder);
router.route("/:orderId").delete(order_controllers_1.cancelOrder);
exports.default = router;
