import mongoose from "mongoose";
import { setSchemaOptions } from "../lib/mongoose-custom-plugins";

mongoose.plugin(setSchemaOptions);

/* Import the models after setting schema options by a mongoose plugin */
import Product from "./user.model";
import User from "./user.model";
import Bakery from "./user.model";
import Order from "./order.model";

export { Product, User, Bakery, Order };
