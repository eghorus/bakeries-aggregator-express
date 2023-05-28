import mongoose, { Types } from "mongoose";

type IBakery = {
  title: string;
  images: {
    logo: string;
    cover: string;
  };
  ratingAvg: number;
  ratingQty: number;
  products: Types.ObjectId[];
};

const bakerySchema = new mongoose.Schema<IBakery>({
  title: String,
  images: {
    logo: String,
    cover: String,
  },
  ratingAvg: {
    type: Number,
    default: 0,
  },
  ratingQty: {
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
