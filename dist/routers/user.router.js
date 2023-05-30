"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_authentication_1 = __importDefault(require("../middlewares/check-authentication"));
const user_controllers_1 = require("../controllers/user.controllers");
const router = express_1.default.Router();
router.route("/account").get(check_authentication_1.default, user_controllers_1.getUser);
router.route("/signup").post(user_controllers_1.createUser);
router.route("/signin").post(user_controllers_1.authenticateUser);
exports.default = router;
