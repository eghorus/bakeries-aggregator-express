"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Category;
(function (Category) {
    Category["Cakes"] = "Cakes";
    Category["Bread"] = "Bread";
    Category["BrowniesAndBars"] = "Brownies & Bars";
    Category["Cookies"] = "Cookies";
    Category["Frosting"] = "Frosting";
    Category["Pies"] = "Pies";
})(Category || (Category = {}));
const productSchema = new mongoose_1.default.Schema({
    title: String,
    image: String,
    category: {
        type: String,
        enum: {
            values: ["Cakes", "Bread", "Brownies & Bars", "Cookies", "Frosting", "Pies"],
            message: "Category field must be one of 'Cakes', 'Bread', 'Brownies & Bars', 'Cookies', 'Frosting', 'Pies'",
        },
    },
    price: Number,
    bakery: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Bakery",
    },
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
