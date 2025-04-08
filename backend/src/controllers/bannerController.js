import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";
import mongoose from "mongoose";
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import { deleteFile, uploadFile } from "../helpers/uploadHelpers.js";

// Create a new banner
export const createBanner = asyncHandler(async (req, res) => {
  let banner = req.files?.banner
  if (!banner) {
    res.status(400).json({
      success: false,
      message: "Banner is required"
    });
  }

  const uploadResponse = await uploadFile(banner, 'new_banners')
  let newBanner = new Banner({
    title: req.body?.title,
    url: uploadResponse.url
  });

  newBanner = await newBanner.save();
  res.status(200).json({
    success: true,
    message: "Banner added successfully",
    banner: newBanner
  });
});

// Get all banners
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res.status(200).json({
    success: true,
    message: "Banners fetched successfully",
    banners,
  });
});

// Delete a banner
export const deleteBanner = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid Banner ID"
    });
  }

  const banner = await Banner.findById(id);
  console.log("BANNER - ", banner)
  if (!banner) {
    res.status(404).json({
      success: false,
      message: "Banner not found"
    })
  }

  const deleteResult = await deleteFile(banner.url)
  if(deleteResult.deleted) {
    await Banner.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: deleteResult.message
    })
  }
});
