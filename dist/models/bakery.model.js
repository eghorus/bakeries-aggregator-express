"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bakerySchema = new mongoose_1.default.Schema({
    title: String,
    images: {
        logo: String,
        cover: String,
    },
    ratingAvg: {
        type: Number,
        default: 0,
    },
    ratingQty: {
        type: Number,
        default: 0,
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});
const Bakery = mongoose_1.default.model("Bakery", bakerySchema);
exports.default = Bakery;
