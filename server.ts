import mongoose from "mongoose";
import dotenv from "dotenv";

/* Register a listener for the uncaughtException process event (synchronous error) before any code */
process.on("uncaughtException", function (err) {
  console.log("🛑 uncaughtException:\n", err);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") dotenv.config();
/* Import app after configuring dotenv */
import app from "./app";

/* Connect to the database */
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

/* Start the server */
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started and listening on port ${process.env.PORT}.`)
);

/* Register a listener for the unhandledRejection process event (asynchronous error) */
process.on("unhandledRejection", function (err) {
  console.log("🛑 unhandledRejection:\n", err);
  server.close(() => process.exit(1));
});
