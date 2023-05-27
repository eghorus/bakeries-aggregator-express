import mongoose from "mongoose";
import { setSchemaOptions } from "../lib/mongoose-custom-plugins";

mongoose.plugin(setSchemaOptions);

/* import the models after setting schema options by a mongoose plugin */
import User from "./user.model";

export { User };
