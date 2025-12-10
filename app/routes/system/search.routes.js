const express = require("express");
const { getListSearch } = require("../../controllers/system/search.controller");

const router = express.Router();

router.post('/list',getListSearch);

module.exports = router;