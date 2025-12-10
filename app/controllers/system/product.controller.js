const {productServices, productAdminServices} = require("../../services/system/product.service");
const Product = require('../../models/system/product.model');
const { BadRequestException } = require('../../common/helpers/error.helper');
const { ACCESS_TOKEN_SECRET } = require('../../common/constant/app.constant');

const productAdminController = {

  getProducts: async (req, res) => {
    try {
      const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;

      const { productList, totalRecords } = await productAdminServices.getProducts(skip, take, where, search, sorted, requiresCounts);

      res.status(200).json({
        result: productList,
        count: totalRecords,
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      res.status(500).json({ message: 'Error fetching product data', error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { _id, title, features, images, blueprint, floor1, floor2, floor3 } = req.body;
      const productCreated = await productAdminServices.createProduct(_id, title, features, images, blueprint, floor1, floor2, floor3);
      res.status(200).json({ result: true, message: 'Product created successfully', data: productCreated });
    } catch (error) {
      console.error('Error creating Product:', error);
      res.status(500).json({ message: 'Error creating Product', error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    let result;
    try {
      const { _id } = req.body;
      const productDeleted = await productAdminServices.deleteProduct(_id);
      result = true;
      res.status(200).json({ result, message: 'Product deleted successfully', data: productDeleted });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

};

const productController = {
      getProducts: async (req, res) => {
        try {
          const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;
    
          const { productDataList, totalRecords } = await productServices.getProducts(skip, take, where, search, sorted, requiresCounts);
    
          res.status(200).json({
            result: productDataList,
            count: totalRecords,
          });
        } catch (error) {
          console.error('Error fetching product data:', error);
          res.status(500).json({ message: 'Error fetching product data', error: error.message });
        }
      },
      getProductsDetail: async (req, res) => {
        try {
          const { slug } = req.body;
          const productDetail = await productServices.getProductsDetail(slug);
          if (!productDetail) {
            return res.status(404).json({
              result: false,
              message: 'Product not found'
            });
          }
          res.status(200).json({
            result: true,
            message: 'Product found',
            data: productDetail
          });
        } catch (error) {
          res.status(500).json({
            result: false,
            message: error.message
          });
        }
      },
}

module.exports = { productAdminController, productController };
