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
const dotenv_1 = __importDefault(require("dotenv"));
/* Register a listener for the uncaughtException process event (synchronous error) before any code */
process.on("uncaughtException", function (err) {
    console.log("🛑 uncaughtException:\n", err);
    process.exit(1);
});
if (process.env.NODE_ENV !== "production")
    dotenv_1.default.config();
/* Import app after configuring dotenv */
const app_1 = __importDefault(require("./app"));
/* Connect to the database */
const mongodbConnUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(mongodbConnUri);
        console.log(`Connected to ${connection.connections[0].name} database.`);
    }
    catch (error) {
        console.log("🛑 Error connecting to database.", "\n", error);
        server.close(() => process.exit(1));
    }
});
connectToDb();
/* Start the server */
const server = app_1.default.listen(process.env.PORT, () => console.log(`Server started and listening on port ${process.env.PORT}.`));
/* Register a listener for the unhandledRejection process event (asynchronous error) */
process.on("unhandledRejection", function (err) {
    console.log("🛑 unhandledRejection:\n", err);
    server.close(() => process.exit(1));
});
