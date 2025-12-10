const express = require("express");
const { newandeventAdminController, newandeventController } = require("../../controllers/system/newandevent.controller");
const { authenticateJWT } = require("../../middlewares/authMiddleware");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware');

const router = express.Router();

// Admin Only
router.post("/list", newandeventAdminController.getNewandevent);
router.post("/createorupdate", newandeventAdminController.createNewandevent);
router.delete("/delete", newandeventAdminController.deleteNewandevent);
router.post("/update-status", newandeventAdminController.updateStatusNewandevent);

// Landing Page Only
router.get("/", newandeventController.getNewandevent);
router.post("/detail", newandeventController.getNewandeventDetail);
router.post("/find-new-event", newandeventController.findNewEvent)

module.exports = router;
