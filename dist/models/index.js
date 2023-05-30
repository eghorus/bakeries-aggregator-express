"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Bakery = exports.User = exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_custom_plugins_1 = require("../lib/mongoose-custom-plugins");
mongoose_1.default.plugin(mongoose_custom_plugins_1.setSchemaOptions);
/* Import the models after setting schema options by a mongoose plugin */
const product_model_1 = __importDefault(require("./product.model"));
exports.Product = product_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const bakery_model_1 = __importDefault(require("./bakery.model"));
exports.Bakery = bakery_model_1.default;
const order_model_1 = __importDefault(require("./order.model"));
exports.Order = order_model_1.default;
