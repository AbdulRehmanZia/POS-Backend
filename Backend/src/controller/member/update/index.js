import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//update Store Member
export const updateStoreMember = async (req, res) => {
  try {
    const userId = req.params.id;

    const { fullname, email, password, role } = req.body;
    const updatedData = {};
    if (fullname !== undefined) updatedData.fullname = fullname;
    if (email !== undefined) updatedData.email = email;
    if (password !== undefined) updatedData.password = password;
    if (role != undefined) updatedData.role = role;

    if (Object.keys(updatedData).length === 0) {
      return ApiError(res, 400, "No valid fields provided for update");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: updatedData,
      select: {
        fullname: true,
        email: true,
        role: true,
      },
    });

    return ApiResponse(res, 200, updatedUser, "User Updated Successfully");
  } catch (error) {
    console.error("Error in updateMember:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};