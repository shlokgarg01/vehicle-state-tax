import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";
import mongoose from "mongoose";

// Create a new banner
const createBanner = asyncHandler(async (req, res) => {
  const { title, imageUrl, description, status } = req.body;

  const newBanner = new Banner({
    title,
    imageUrl,
    description,
    status,
  });

  const banner = await newBanner.save();
  res.status(201).json(banner);
});

// Get all banners
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});

// Get a single banner by ID
const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.json(banner);
});

// Update a banner
const updateBanner = asyncHandler(async (req, res) => {
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
const deleteBanner = asyncHandler(async (req, res) => {
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

export { createBanner, getBanners, getBannerById, updateBanner, deleteBanner };
