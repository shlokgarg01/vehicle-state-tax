import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
// Create a new banner
export const createBanner = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(req.file);
  if (!req.file || !req.file.path) {
    res.status(400);
    throw new Error("Image upload failed");
  }

  const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
    folder: "banners",
    transformation: [{ width: 800, height: 400, crop: "limit" }],
  });
  console.log(cloudinaryResult);

  fs.unlinkSync(req.file.path);

  const newBanner = new Banner({
    title,
    imageUrl: cloudinaryResult.secure_url,
    description,
  });

  const banner = await newBanner.save();
  res.status(201).json(banner);
});

// Get all banners
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});

// Get a single banner by ID
export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.json(banner);
});

// Update a banner
export const updateBanner = asyncHandler(async (req, res) => {
  const { title, imageUrl, description, status } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  banner.title = title || banner.title;
  banner.imageUrl = imageUrl || banner.imageUrl;
  banner.description = description || banner.description;
  banner.status = status || banner.status;

  await banner.save();

  res.json({ message: "Banner updated successfully", banner });
});

// Delete a banner
export const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Banner ID");
  }

  const banner = await Banner.findById(id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  await Banner.deleteOne({ _id: id });

  res.json({ message: "Banner deleted successfully" });
});
