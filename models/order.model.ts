import mongoose, { Types } from "mongoose";
import { IProduct } from "./product.model";

type IOrder = {
  date: Date;
  products: Omit<IProduct, "bakery">[];
  isCompleted: boolean;
  rating: number;
  user: Types.ObjectId;
  bakery: Types.ObjectId;
};

const orderSchema = new mongoose.Schema<IOrder>({
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: [
      {
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
      },
    ],
    required: [true, "Product list field is required."],
    validate: [
      {
        validator: (val: Omit<IProduct, "bakery">[]) => val.length >= 1,
        message: "Product list field must include at least 1 product.",
      },
      {
        validator: (val: Omit<IProduct, "bakery">[]) => val.length <= 10,
        message: "Product list field must include at most 10 products.",
      },
    ],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    validate: {
      validator: function (this: IOrder, val: number) {
        return val > 0 && this.isCompleted;
      },
      message: "Rating field can only be set if the order is completed.",
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required."],
  },
  bakery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bakery",
    required: [true, "Bakery field is required."],
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
