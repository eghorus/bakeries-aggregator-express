import mongoose, { Types } from "mongoose";

enum Category {
  Cakes = "Cakes",
  Bread = "Bread",
  BrowniesAndBars = "Brownies & Bars",
  Cookies = "Cookies",
  Frosting = "Frosting",
  Pies = "Pies",
}

export type IProduct = {
  title: string;
  image: string;
  category: Category;
  price: number;
  bakery: Types.ObjectId;
};

const productSchema = new mongoose.Schema<IProduct>({
  title: String,
  image: String,
  category: {
    type: String,
    enum: {
      values: ["Cakes", "Bread", "Brownies & Bars", "Cookies", "Frosting", "Pies"],
      message: "Category field must be one of 'Cakes', 'Bread', 'Brownies & Bars', 'Cookies', 'Frosting', 'Pies'",
    },
  },
  price: Number,
  bakery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bakery",
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
