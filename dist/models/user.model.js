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
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "User name field is required."],
        minlength: [5, "User name field must be at least 5 characters."],
        maxlength: [30, "User name field must be at most 30 characters."],
        validate: {
            validator: function (val) {
                return validator_1.default.isAlphanumeric(val, "en-US", { ignore: " .-" });
            },
            message: "User name field must contain only alphanumeric characters, spaces, dots, and dashes.",
        },
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "User email field is required."],
        validate: {
            validator: function (val) {
                return validator_1.default.isEmail(val);
            },
            message: (props) => `${props.value} is not a valid email address.`,
        },
        lowercase: true,
        trim: true,
    },
    image: {
        src: {
            type: String,
        },
    },
    password: {
        type: String,
        required: [true, "User password field is required."],
        minlength: [8, "User password field must be at least 8 characters."],
        maxlength: [100, "User password field must be at most 100 characters."],
        select: false,
    },
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});
userSchema.methods.isPasswordValid = function (inputPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValid = yield bcryptjs_1.default.compare(inputPassword, this.password);
        return isValid;
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const hashedPassword = yield bcryptjs_1.default.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    });
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
