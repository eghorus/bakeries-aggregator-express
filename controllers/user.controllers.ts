import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import OpError from "../lib/operational-error";
import { signJwtToken } from "../lib/jwt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    res.status(201).json({
      status: "Success",
      message: "Your account has been created successfully. Please sign in with your email and password.",
    });
  } catch (error) {
    next(error);
  }
};

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new OpError(400, "Email and password fields are required for user authentication."));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isPasswordValid(password))) {
      return next(new OpError(401, "Invalid email or password."));
    }
    user.password = "";

    const accessToken = signJwtToken({ id: user._id.toString() });

    res.status(200).json({
      status: "Success",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.authenticatedUser;

    res.status(200).json({
      status: "Success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export { createUser, authenticateUser, getUser };
