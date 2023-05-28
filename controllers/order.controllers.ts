import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import OpError from "../lib/operational-error";
import { Order, User } from "../models";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { products, bakeryId } = req.body;
    if (!products || !bakeryId) {
      return next(new OpError(400, "Products and bakery fields are required to create an order."));
    }
    const userId = res.locals.authenticatedUser.id;

    const order = await Order.create({ products, user: userId, bakery: bakeryId });
    const user = await User.findOne({ _id: userId });
    user?.orders.push(order._id);
    await user?.save();

    res.status(201).json({
      status: "Success",
      message: "Your order has been placed successfully. Please mark it as completed after collecting it.",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const completeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.isValidObjectId(orderId)) {
      return next(new OpError(400, "The id provided is not a valid id."));
    }
    const { rating } = req.body;
    if (!rating) {
      return next(new OpError(400, "Rating field is required to mark an order as completed."));
    }
    const userId = res.locals.authenticatedUser.id;
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return next(new OpError(404, "No order found with this id and created by the currently authenticated user."));
    }
    if (order.rating > 0) {
      return next(new OpError(400, "Can't rate an order that was given a rating or marked as completed before."));
    }

    order.isCompleted = true;
    order.rating = rating;
    await order.save();

    res.status(200).json({
      status: "Success",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const userId = res.locals.authenticatedUser.id;
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return next(new OpError(404, "No order found with this id and created by the currently authenticated user."));
    }
    if (order.isCompleted) {
      return next(new OpError(400, "Can't delete an order that was given a rating or marked as completed before."));
    }

    await order.deleteOne();

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export { createOrder, completeOrder, cancelOrder };
