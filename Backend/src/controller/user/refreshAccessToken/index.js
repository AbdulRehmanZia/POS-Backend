//Refresh Access Token
import jwt from "jsonwebtoken";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../db/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../services/jwt.service.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken)
      return ApiError(res, 401, "Unauthorized Request");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });
    if (!user) return ApiError(res, 401, "Invalid Refresh Token");

    if (incomingRefreshToken !== user.refreshToken)
      return ApiError(res, 401, "Refresh Token Is Expired Or Used");

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", newRefreshToken, options);
    return ApiResponse(
      res,
      201,
      { accessToken, newRefreshToken },
      "Access Refreshed Token"
    );
  } catch (error) {
    console.error("Error in New Refresh Token:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
