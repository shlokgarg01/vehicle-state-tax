import bucket from "../config/firebase/firebaseBucket.js";

export const uploadFile = async (fileData, folderName) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const fullName = fileData.name;

    const match = fullName.match(
      /^(?<originalFileName>.+?)\.(?<extension>[a-zA-Z0-9]+)$/
    );

    if (!match?.groups) {
      return resolve({
        isUploaded: false,
        message: "Invalid file name format.",
        url: "",
      });
    }

    let { originalFileName } = match.groups;
    originalFileName = originalFileName.replace(/\s+/g, "_");

    const fileName = `${timestamp}_${originalFileName}`;
    const file = bucket.file(`${folderName}/${fileName}`);

    const stream = file.createWriteStream({
      metadata: {
        contentType: fileData.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("File Upload error:", err);
      return resolve({
        isUploaded: false,
        message: "Upload failed.",
        url: "",
      });
    });

    stream.on("finish", async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}`;
        return resolve({
          isUploaded: true,
          url: publicUrl,
          message: "File Uploaded",
        });
      } catch (err) {
        console.error("Error making file public:", err);
        return resolve({
          isUploaded: false,
          message: "Upload failed. Please try again.",
          url: "",
        });
      }
    });

    stream.end(fileData.data);
  });
};
