import express from "express";
import { getAllBakeries, getBakery } from "../controllers/bakery.controllers";

const router = express.Router();

router.route("/").get(getAllBakeries);
router.route("/:bakeryId").get(getBakery);

export default router;
