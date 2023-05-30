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
exports.getUser = exports.authenticateUser = exports.createUser = void 0;
const operational_error_1 = __importDefault(require("../lib/operational-error"));
const models_1 = require("../models");
const jwt_1 = require("../lib/jwt");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new operational_error_1.default(400, "Name, email, and password fields are required for user sign up."));
        }
        const user = yield models_1.User.create({ name, email, password });
        res.status(201).json({
            status: "Success",
            message: "Your account has been created successfully. Please sign in with your email and password.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new operational_error_1.default(400, "Email and password fields are required for user authentication."));
        }
        const user = yield models_1.User.findOne({ email }).select("+password");
        if (!user || !(yield user.isPasswordValid(password))) {
            return next(new operational_error_1.default(401, "Invalid email or password."));
        }
        user.password = "";
        const accessToken = (0, jwt_1.signJwtToken)({ id: user._id.toString() });
        res.status(200).json({
            status: "Success",
            data: {
                user,
                accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateUser = authenticateUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.authenticatedUser.id;
        const user = yield models_1.User.findOne({ _id: userId }).populate({ path: "orders", populate: { path: "bakery" } });
        if (!user) {
            return next(new operational_error_1.default(404, "No user found with this id."));
        }
        res.status(200).json({
            status: "Success",
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
