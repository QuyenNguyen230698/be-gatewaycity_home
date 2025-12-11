const express = require("express");
const userController = require("../../controllers/admin/user.controller.js");
const { authenticateJWT } = require("../../middlewares/authMiddleware.js");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware.js');

const router = express.Router();

router.get("/", userController.checkRun);
router.get("/list", authenticateJWT, checkAdminRole, userController.getUsers);

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/login-admin", userController.loginAdmin)

router.post("/update-role", authenticateJWT, checkAdminRole, userController.updateRole)
router.post("/update", authenticateJWT, checkAdminRole, userController.updateUser)
router.post("/delete", authenticateJWT, checkAdminRole, userController.deleteUser)
router.post("/find-user", authenticateJWT, checkAdminRole, userController.findUser)

module.exports = router;
