import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";


//Logout User
export const logoutUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    const options = {
      httpOnly: true,
      secure: true,
       maxAge: 7 * 24 * 60 * 60 * 1000 
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    return ApiResponse(res, 200, null, "User Logged Out Successfully");
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
