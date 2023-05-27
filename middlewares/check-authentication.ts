import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import OpError from "../lib/operational-error";
import { verifyJwtToken } from "../lib/jwt";
import { User } from "../models";

const checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken =
      req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
    if (!accessToken) {
      return next(new OpError(401, "You are not signed in. Please sign in to access this content."));
    }

    const decodedAccessToken = verifyJwtToken(accessToken) as JwtPayload & { id: string };

    const user = await User.findOne({ _id: decodedAccessToken.id });
    if (!user) {
      return next(new OpError(404, `No user is associated with this access token.`));
    }

    res.locals.authenticatedUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { checkAuthentication };
