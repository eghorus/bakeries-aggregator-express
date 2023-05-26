import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", function (err) {
  console.log("🛑 uncaughtException:\n", err);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") dotenv.config();
import app from "./app";

const mongodbConnUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(mongodbConnUri);
    console.log(`Connected to ${connection.connections[0].name} database.`);
  } catch (error) {
    console.log("🛑 Error connecting to database.", "\n", error);
    server.close(() => process.exit(1));
  }
};
connectToDb();

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started and listening on port ${process.env.PORT}.`)
);

process.on("unhandledRejection", function (err) {
  console.log("🛑 unhandledRejection:\n", err);
  server.close(() => process.exit(1));
});
