import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";
import mongoose from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { deleteFile, uploadFile } from "../helpers/uploadHelpers.js";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Create a new banner
export const createBanner = asyncHandler(async (req, res) => {
  let banner = req.files?.banner;
  if (!banner) {
    res.status(400).json({
      success: false,
      message: "Banner is required",
    });
  }

  const uploadResponse = await uploadFile(banner, "new_banners");
  let newBanner = new Banner({
    title: req.body?.title,
    url: uploadResponse.url,
    status: req.body?.status || CONSTANTS.STATUS.ACTIVE,
  });

  newBanner = await newBanner.save();
  console.log("Banner saved:", newBanner);
  res.status(200).json({
    success: true,
    message: "Banner added successfully",
    banner: newBanner,
  });
});

// Get all banners

export const getBanners = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const apiFeatures = new ApiFeatures(Banner.find(), req.query)
    .search(["title", "status"])
    .filter()
    .pagination(resultPerPage);

  const banners = await apiFeatures.query;
  const totalBanners = await Banner.countDocuments();

  res.status(200).json({
    success: true,
    message: "Banners fetched successfully",
    totalBanners,
    currentPage: page,
    totalPages: Math.ceil(totalBanners / resultPerPage),
    data: banners,
  });
});

// Delete a banner
export const deleteBanner = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid Banner ID",
    });
  }

  const banner = await Banner.findById(id);
  console.log("BANNER - ", banner);
  if (!banner) {
    res.status(404).json({
      success: false,
      message: "Banner not found",
    });
  }

  const deleteResult = await deleteFile(banner.url);
  if (deleteResult.deleted) {
    await Banner.delete({ _id: id });
    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: deleteResult.message,
    });
  }
});
