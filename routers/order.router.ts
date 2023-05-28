import express from "express";
import checkAuthentication from "../middlewares/check-authentication";
import { cancelOrder, completeOrder, createOrder } from "../controllers/order.controllers";

const router = express.Router();

router.use(checkAuthentication);
router.route("/").post(createOrder);
router.route("/:orderId").patch(completeOrder);
router.route("/:orderId").delete(cancelOrder);

export default router;
