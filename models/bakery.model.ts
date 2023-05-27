import mongoose, { Types } from "mongoose";

type IBakery = {
  title: string;
  image: string;
  ratingsAvg: number;
  ratingsQuantity: number;
  products: Types.ObjectId[];
};

const bakerySchema = new mongoose.Schema<IBakery>({
  title: String,
  image: String,
  ratingsAvg: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Bakery = mongoose.model("Bakery", bakerySchema);

export default Bakery;
