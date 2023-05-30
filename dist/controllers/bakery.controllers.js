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
exports.getBakery = exports.getAllBakeries = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const operational_error_1 = __importDefault(require("../lib/operational-error"));
const getAllBakeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bakeries = yield models_1.Bakery.find();
        res.status(200).json({
            status: "Success",
            data: {
                bakeries,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBakeries = getAllBakeries;
const getBakery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bakeryId } = req.params;
        if (!mongoose_1.default.isValidObjectId(bakeryId)) {
            return next(new operational_error_1.default(400, "The id provided is not a valid id."));
        }
        const bakery = yield models_1.Bakery.findOne({ _id: bakeryId }).populate("products");
        if (!bakeryId) {
            return next(new operational_error_1.default(404, "No bakery found with this id."));
        }
        res.status(200).json({
            status: "Success",
            data: {
                bakery,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBakery = getBakery;
