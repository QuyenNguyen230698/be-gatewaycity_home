const Product = require('../../models/system/product.model.js');
const search = require('../../models/system/search.models.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { responseSuccess } = require('../../common/helpers/responsive.helper.js');
const { htmlToPlainText } = require('../../utils/filter.js');
const { buildQuery, buildSearchQuery } = require('../../utils/queryBuilder.js');

const productAdminServices = {
  getProducts: async (skip, take, where, search, sorted, requiresCounts) => {
    try {
        let query = buildQuery(where);
        query = { $and: [query, { status: { $ne: 'archived' } }] };

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

        let productList = await Product.find(query)
            .sort(sortOptions)
            .skip(parseInt(skip, 10))
            .limit(parseInt(take, 10))
            .lean();

        if (productList.length > 0) {
            productList = productList.map(item => ({
                ...item,
                createdBy: item.systemInfo?.createdBy,
                updatedBy: item.systemInfo?.updatedBy,
                lastUpdated: item.systemInfo?.lastUpdated,
                systemInfo: undefined, // Remove systemInfo field
            }));
        }

        const totalRecords = requiresCounts ? await Product.countDocuments(query) : undefined;

        return { productList, totalRecords };
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw new Error('Failed to fetch product data');
    }
  },

createProduct: async (_id, title, features, images, blueprint, floor1, floor2, floor3, floor4) => {
  try {
    // Nếu có _id → cập nhật, không có _id → tạo mới
    if (_id) {
      // Cập nhật (nếu không tìm thấy thì ném lỗi)
      const existing = await Product.findById(_id);
      if (!existing) {
        throw new Error('New and event not found');
      }

      await Product.updateOne(
        { _id },
        { title, features, images, blueprint, floor1, floor2, floor3, floor4, updatedAt: Date.now() }
      );
      findProduct = await Product.findOne({ _id });
      await search.updateOne(
        { _idRef: _id },
        { slug: "san-pham/" + findProduct.slug,
          name: "Sản phẩm",
          child: findProduct.title,
          description: findProduct.title + " " + htmlToPlainText(findProduct.description)
         }
      );

      return responseSuccess(`Product "${title}" updated successfully`);
    } else {
      // Tạo mới
      const newProduct = new Product({
        title,
        features,
        images,
        blueprint,
        floor1,
        floor2,
        floor3,
        floor4,
      });
      await newProduct.save();
      await search.create({
        _idRef: newProduct._id,
        slug: "san-pham/" + newProduct.slug,
        name: "Sản phẩm",
        child: newProduct.title,
        description: newProduct.title + " " + htmlToPlainText(newProduct.description)
      });

      return responseSuccess(`Product "${title}" created successfully`);
    }
  } catch (error) {
    console.error('Error in createOrUpdateProduct:', error);
    
    // Giữ nguyên thông báo lỗi gốc nếu có, nếu không thì thông báo chung
    const message = error.message || 'Failed to save Product';
    throw new Error(message);
  }
},

  deleteProduct: async (_id) => {
    try {
      await Product.findOneAndDelete({ _id });
      await search.findOneAndDelete({ _idRef: _id });
    
      return responseSuccess(`Product deleted successfully`);
    } catch (error) {
      console.error('Error deleting Product:', error);
      throw new Error('Failed to delete Product');
    }
  },
};

const productServices = {
    getProducts: async (skip, take, where, search, sorted, requiresCounts) => {
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
    
            let productDataList = await Product.find(query)
                .sort(sortOptions)
                .skip(parseInt(skip, 10))
                .limit(parseInt(take, 10))
                .lean();
    
            if (productDataList.length > 0) {
                productDataList = productDataList.map(item => ({
                    ...item,
                    createdBy: item.systemInfo?.createdBy,
                    updatedBy: item.systemInfo?.updatedBy,
                    lastUpdated: item.systemInfo?.lastUpdated,
                    systemInfo: undefined, // Remove systemInfo field
                }));
            }
    
            const totalRecords = requiresCounts ? await Product.countDocuments(query) : undefined;
    
            return { productDataList, totalRecords };
        } catch (error) {
            console.error('Error fetching product data:', error);
            throw new Error('Failed to fetch product data');
        }
    },
    getProductsDetail: async (slug) => {
        try {
            const productDetail = await Product.findOne({ slug });
            return productDetail;
        } catch (error) {
            console.error('Error getting product detail:', error);
            throw new Error('Failed to get product detail');
        }
    }
}

module.exports = { productAdminServices, productServices };