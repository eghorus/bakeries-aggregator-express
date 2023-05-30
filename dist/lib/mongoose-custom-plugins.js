"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSchemaOptions = void 0;
function setSchemaOptions(schema) {
    schema.set("toJSON", { getters: true });
    schema.set("toObject", { getters: true });
    schema.set("timestamps", true);
}
exports.setSchemaOptions = setSchemaOptions;
