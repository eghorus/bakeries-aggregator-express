import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Bakery } from "../models";
import OpError from "../lib/operational-error";

const getAllBakeries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bakeries = await Bakery.find().populate("products");

    res.status(200).json({
      status: "Success",
      data: {
        bakeries,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBakery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bakeryId } = req.params;
    if (!mongoose.isValidObjectId(bakeryId)) {
      return next(new OpError(400, "The id provided is not a valid id."));
    }
    const bakery = await Bakery.findOne({ _id: bakeryId }).populate("products");
    if (!bakeryId) {
      return next(new OpError(404, "No bakery found with this id."));
    }

    res.status(200).json({
      status: "Success",
      data: {
        bakery,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getAllBakeries, getBakery };
