"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bakery_controllers_1 = require("../controllers/bakery.controllers");
const router = express_1.default.Router();
router.route("/").get(bakery_controllers_1.getAllBakeries);
router.route("/:bakeryId").get(bakery_controllers_1.getBakery);
exports.default = router;
