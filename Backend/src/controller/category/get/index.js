import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//get All Categories
export const getAllCategories = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit <= 0 || limit > 100) limit = 10;
    const skip = (page - 1) * limit;
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
      skip: skip,
      take: limit,
    });
    if (!categories) return ApiError(res, 404, "Categories Not Found");
    const totalCategories = await prisma.category.count();
    const totalPages = Math.ceil(totalCategories / limit);
    return ApiResponse(
      res,
      200,
      categories,
      "Categories Fetched Successfully",
      { totalPages, currentPage: page, limit }
    );
  } catch (error) {
    console.error("Error in getCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
