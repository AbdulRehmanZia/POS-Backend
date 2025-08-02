import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import prisma from "../db/db.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return ApiError(res, 401, "Unauthorized request");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: { id: true, fullname: true, email: true, role:true },
    });
    if (!user) return ApiError(res, 401, "Invalid Access Token");
    req.user = user
    next();
  } catch (error) {
    console.log("Error: ", error);
  }
};

