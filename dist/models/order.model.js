"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const orderSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    products: {
        type: [
            {
                // Need a fix to make all product fields are required
                _id: mongoose_1.default.Schema.Types.ObjectId,
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                    max: 10,
                },
                title: String,
                image: String,
                category: {
                    type: String,
                    enum: {
                        values: ["Cakes", "Bread", "Brownies & Bars", "Cookies", "Frosting", "Pies"],
                        message: "Category field must be one of 'Cakes', 'Bread', 'Brownies & Bars', 'Cookies', 'Frosting', 'Pies'.",
                    },
                },
                price: Number,
                bakery: mongoose_1.default.Schema.Types.ObjectId,
            },
        ],
        required: [true, "Product list field is required."],
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: [1, "Rating field must be between 1 to 5."],
        max: [5, "Rating field must be between 1 to 5."],
        required: function () {
            return this.isCompleted;
        },
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User field is required."],
    },
    bakery: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Bakery",
        required: [true, "Bakery field is required."],
    },
});
orderSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc.isModified("rating")) {
            return next;
        }
        yield doc.constructor.calcBakeryAvgRating(doc.bakery._id);
        next;
    });
});
orderSchema.statics.calcBakeryAvgRating = function (bakeryId) {
    return __awaiter(this, void 0, void 0, function* () {
        const ratingStats = yield this.aggregate([
            {
                $match: { bakery: bakeryId },
            },
            {
                $group: {
                    _id: "$bakery",
                    ratingQty: { $sum: 1 },
                    ratingAvg: { $avg: "$rating" },
                },
            },
        ]);
        const bakery = yield _1.Bakery.findOne({ _id: bakeryId });
        if (bakery) {
            bakery.ratingAvg = ratingStats[0] ? Number(ratingStats[0].ratingAvg) : 0;
            bakery.ratingQty = ratingStats[0] ? Number(ratingStats[0].ratingQty) : 0;
            yield bakery.save();
        }
    });
};
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
