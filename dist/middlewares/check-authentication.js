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
const operational_error_1 = __importDefault(require("../lib/operational-error"));
const jwt_1 = require("../lib/jwt");
const models_1 = require("../models");
function checkAuthentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
                ? req.headers.authorization.split(" ")[1]
                : null;
            if (!accessToken) {
                return next(new operational_error_1.default(401, "You are not signed in. Please sign in to access this content."));
            }
            const decodedAccessToken = (0, jwt_1.verifyJwtToken)(accessToken);
            const user = yield models_1.User.findOne({ _id: decodedAccessToken.id });
            if (!user) {
                return next(new operational_error_1.default(404, `No user is associated with this access token.`));
            }
            user.password = "";
            res.locals.authenticatedUser = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = checkAuthentication;
