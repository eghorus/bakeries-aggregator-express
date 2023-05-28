import express from "express";
import { getAllBakeries, getBakery } from "../controllers/bakery.controllers";

const router = express.Router();

router.get("/", getAllBakeries);
router.get("/:bakeryId", getBakery);

export default router;
