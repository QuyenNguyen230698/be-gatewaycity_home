const express = require("express");
const { quotepriceController } = require("../../controllers/system/quoteprice.controller.js");
const { authenticateJWT } = require("../../middlewares/authMiddleware.js");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware.js');

const router = express.Router();

// Admin Only
router.post("/list", quotepriceController.getQuotePrice);
// router.post("/create", authenticateJWT, checkAdminRole, quotepriceAdminController.createQuotePrice);
// router.post("/update", authenticateJWT, checkAdminRole, quotepriceAdminController.updateQuotePrice);
// router.post("/delete", authenticateJWT, checkAdminRole, quotepriceAdminController.deleteQuotePrice);

// Landing Page Only
router.post("/create", quotepriceController.createQuotePrice)

module.exports = router;
