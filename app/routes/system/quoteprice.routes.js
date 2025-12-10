const express = require("express");
const { quotepriceController } = require("../../controllers/system/quoteprice.controller");
const { authenticateJWT } = require("../../middlewares/authMiddleware");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware');

const router = express.Router();

// Admin Only
// router.get("/list", authenticateJWT, checkAdminRole, quotepriceAdminController.getQuotePrice);
// router.post("/create", authenticateJWT, checkAdminRole, quotepriceAdminController.createQuotePrice);
// router.post("/update", authenticateJWT, checkAdminRole, quotepriceAdminController.updateQuotePrice);
// router.post("/delete", authenticateJWT, checkAdminRole, quotepriceAdminController.deleteQuotePrice);

// Landing Page Only
router.post("/create", quotepriceController.createQuotePrice)

module.exports = router;
