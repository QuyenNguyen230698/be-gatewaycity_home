const express = require("express");
const { productAdminController, productController } = require("../../controllers/system/product.controller");
const { authenticateJWT } = require("../../middlewares/authMiddleware");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware');

const router = express.Router();

// Admin Only
router.get("/list", productAdminController.getProducts);
router.post("/createorupdate", productAdminController.createProduct);
router.delete("/delete", productAdminController.deleteProduct);

// Landing Page Only
router.get("/", productController.getProducts);
router.post("/detail", productController.getProductsDetail);

module.exports = router;
