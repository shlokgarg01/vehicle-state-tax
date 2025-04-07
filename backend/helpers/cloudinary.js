const cloudinary = require("cloudinary");

const uploadImageToCloudinary = async (image, folder) => {
  const result = await cloudinary.v2.uploader.upload_large(image, {
    folder,
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

const updateImageToCloudinary = async (image, newImage, folder) => {
  if (image !== undefined) {
    await cloudinary.v2.uploader.destroy(image.public_id);
    const imagesLink = {};
    const result = await uploadImageToCloudinary(newImage, folder)

    imagesLink.public_id = result.public_id;
    imagesLink.url = result.url;
    return imagesLink
  }
}

module.exports = {
  uploadImageToCloudinary,
  updateImageToCloudinary,
};
