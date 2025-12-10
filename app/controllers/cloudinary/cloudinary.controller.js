const { getFormImage, uploadSingleToCloudinary, deleteFromCloudinary } = require('../../services/cloudinary/cloudinary.service');

const getImage = async (req, res) => {
    try {
      const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;

      const { imageList, totalRecords } = await getFormImage(skip, take, where, search, sorted, requiresCounts);

      res.status(200).json({
        result: imageList,
        count: totalRecords,
      });
    } catch (error) {
      console.error('Error fetching movie data:', error);
      res.status(500).json({ message: 'Error fetching movie data', error: error.message });
    }
};

const uploadImage = async (req, res) => {
  try {
    const folder = req.body.folder || "Media Gateway City";

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Không có file nào được tải lên." });
    }

    // Upload tuần tự hoặc Promise.all để nhanh hơn
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadSingleToCloudinary(file, folder))
    );

    return res.status(200).json({
      message: "Upload thành công!",
      data: uploadedImages,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Lỗi khi upload hình ảnh.",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id' });
    }

    const result = await deleteFromCloudinary(public_id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getImage, uploadImage, deleteImage };
