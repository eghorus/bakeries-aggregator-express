import { Schema } from "mongoose";

function setSchemaOptions(schema: Schema) {
  schema.set("toJSON", { getters: true });
  schema.set("toObject", { getters: true });
  schema.set("timestamps", true);
}

export { setSchemaOptions };
