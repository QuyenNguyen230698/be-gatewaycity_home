const express = require("express");
const userController = require("../../controllers/admin/user.controller");
const { authenticateJWT } = require("../../middlewares/authMiddleware");
const { checkAdminRole } = require('../../middlewares/checkRole.middleware');

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
