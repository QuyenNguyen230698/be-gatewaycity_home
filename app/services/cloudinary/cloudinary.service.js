const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const dotenv = require('dotenv');
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../../common/constant/app.constant.js');
const Cloudinary = require('../../models/cloudinary/cloudinary.model.js'); // Assuming the Cloudinary model is defined in this file
const { responseSuccess } = require('../../common/helpers/responsive.helper.js');

dotenv.config();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const buildQuery = (where) => {
    let query = {};
    Object.keys(where).forEach(key => {
        query[key] = where[key];
    });
    return query;
};

const buildSearchQuery = (search) => {
    let searchQuery = {};
    search.forEach(item => {
        searchQuery[item.name] = { $regex: item.value, $options: 'i' };
    });
    return searchQuery;
};

const getFormImage = async (skip, take, where, search, sorted, requiresCounts) => {
    try {
        let query = buildQuery(where);

        if (search.length > 0) {
            const searchQuery = buildSearchQuery(search);
            query = { $and: [query, searchQuery] };
        }

        let sortOptions = {};
        if (sorted.length > 0) {
            sorted.forEach(sort => {
                sortOptions[sort.name] = sort.direction === 'ascending' ? 1 : -1;
            });
        }

        let imageList = await Cloudinary.find(query)
            .sort(sortOptions)
            .skip(parseInt(skip, 10))
            .limit(parseInt(take, 10))
            .lean();

        if (imageList.length > 0) {
            imageList = imageList.map(item => ({
                ...item,
                createdBy: item.systemInfo?.createdBy,
                updatedBy: item.systemInfo?.updatedBy,
                lastUpdated: item.systemInfo?.lastUpdated,
                systemInfo: undefined, // Remove systemInfo field
            }));
        }

        const totalRecords = requiresCounts ? await Cloudinary.countDocuments(query) : undefined;

        return { imageList, totalRecords };
    } catch (error) {
        console.error('Error fetching Image data:', error);
        throw new Error('Failed to fetch Image data');
    }
};

const uploadSingleToCloudinary = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      async (error, result) => {
        if (error) return reject(error);

        // Lưu vào DB
        const cloudinaryData = new Cloudinary({
          public_id: result.public_id,
          signature: result.signature,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          secure_url: result.secure_url,
          display_name: result.display_name,
        });
        await cloudinaryData.save();

        resolve(cloudinaryData);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, async (error, result) => {
      if (error) return reject(error);

      try {
        const cloudinaryData = await Cloudinary.findOne({ public_id });
        if (!cloudinaryData) {
            return resolve(responseSuccess('File not found'));
        }
        await cloudinaryData.deleteOne({ _id: cloudinaryData._id });
        resolve(responseSuccess(`File deleted successfully`, cloudinaryData));
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = { uploadSingleToCloudinary, deleteFromCloudinary, getFormImage };
