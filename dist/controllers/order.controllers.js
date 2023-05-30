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
exports.cancelOrder = exports.completeOrder = exports.createOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const operational_error_1 = __importDefault(require("../lib/operational-error"));
const models_1 = require("../models");
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products, bakeryId } = req.body;
        if (!products || !bakeryId) {
            return next(new operational_error_1.default(400, "Products and bakery fields are required to create an order."));
        }
        const userId = res.locals.authenticatedUser.id;
        const order = yield models_1.Order.create({ products, user: userId, bakery: bakeryId });
        const user = yield models_1.User.findOne({ _id: userId });
        user === null || user === void 0 ? void 0 : user.orders.push(order._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(201).json({
            status: "Success",
            message: "Your order has been placed successfully. Please mark it as completed after collecting it.",
            data: {
                order,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
const completeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!mongoose_1.default.isValidObjectId(orderId)) {
            return next(new operational_error_1.default(400, "The id provided is not a valid id."));
        }
        const { isCompleted, rating } = req.body;
        if (!isCompleted || !rating) {
            return next(new operational_error_1.default(400, "Rating and isCompleted fields are required to mark an order as completed."));
        }
        const userId = res.locals.authenticatedUser.id;
        const order = yield models_1.Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            return next(new operational_error_1.default(404, "No order found with this id and created by the currently authenticated user."));
        }
        if (order.isCompleted || order.rating >= 1) {
            return next(new operational_error_1.default(400, "Can't rate an order that was given a rating or marked as completed before."));
        }
        order.isCompleted = isCompleted;
        order.rating = rating;
        yield order.save();
        res.status(200).json({
            status: "Success",
            data: {
                order,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.completeOrder = completeOrder;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!mongoose_1.default.isValidObjectId(orderId)) {
            return next(new operational_error_1.default(400, "The id provided is not a valid id."));
        }
        const userId = res.locals.authenticatedUser.id;
        const order = yield models_1.Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            return next(new operational_error_1.default(404, "No order found with this id and created by the currently authenticated user."));
        }
        if (order.isCompleted) {
            return next(new operational_error_1.default(400, "Can't delete an order that was given a rating or marked as completed before."));
        }
        yield order.deleteOne();
        res.status(204).json({
            status: "Success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cancelOrder = cancelOrder;
