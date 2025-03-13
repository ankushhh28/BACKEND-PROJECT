import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

//! IMPORTANT: if no response is used in the method then we can also write "_" in place of res
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    //~ sometimes user send authorization header in place of cookie so for accessing ACCESS_TOKEN from it we use this || option....
    //~ Authorization: Bearer <ACCESS_TOKEN>
    console.log("Token: ", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    //~ decode the token
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    //~ find the user in DB with the help of decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    //~ adding user info to this req
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
