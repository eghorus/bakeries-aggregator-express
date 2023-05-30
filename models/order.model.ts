import mongoose, { Model, PostMiddlewareFunction, Types } from "mongoose";
import { IProduct } from "./product.model";
import { Bakery } from ".";

type IOrder = {
  date: Date;
  products: (IProduct & { _id: Types.ObjectId; quantity: number })[];
  isCompleted: boolean;
  rating: number;
  user: Types.ObjectId;
  bakery: Types.ObjectId;
};

interface IOrderModel extends Model<IOrder> {
  calcBakeryAvgRating: () => void;
}

const orderSchema = new mongoose.Schema<IOrder, IOrderModel>({
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: [
      {
        // Need a fix to make all product fields are required
        _id: mongoose.Schema.Types.ObjectId,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
          max: 10,
        },
        title: String,
        image: String,
        category: {
          type: String,
          enum: {
            values: ["Cakes", "Bread", "Brownies & Bars", "Cookies", "Frosting", "Pies"],
            message:
              "Category field must be one of 'Cakes', 'Bread', 'Brownies & Bars', 'Cookies', 'Frosting', 'Pies'.",
          },
        },
        price: Number,
        bakery: mongoose.Schema.Types.ObjectId,
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
    min: [1, "Rating field must be between 1 to 5."],
    max: [5, "Rating field must be between 1 to 5."],
    required: function (this: IOrder) {
      return this.isCompleted;
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

orderSchema.post("save", async function (doc, next) {
  if (doc.isModified("rating")) {
    return next;
  }
  await doc.constructor.calcBakeryAvgRating(doc.bakery._id);
  next;
} as PostMiddlewareFunction);

orderSchema.statics.calcBakeryAvgRating = async function (bakeryId: string) {
  const ratingStats = await this.aggregate([
    {
      $match: { bakery: bakeryId },
    },
    {
      $group: {
        _id: "$bakery",
        ratingQty: { $sum: 1 },
        ratingAvg: { $avg: "$rating" },
      },
    },
  ]);

  const bakery = await Bakery.findOne({ _id: bakeryId });
  if (bakery) {
    bakery.ratingAvg = ratingStats[0] ? Number(ratingStats[0].ratingAvg) : 0;
    bakery.ratingQty = ratingStats[0] ? Number(ratingStats[0].ratingQty) : 0;
    await bakery.save();
  }
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
