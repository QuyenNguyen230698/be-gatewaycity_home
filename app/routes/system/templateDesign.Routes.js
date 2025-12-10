const express = require('express');
const router = express.Router();
const templateDesignController = require('../../controllers/system/templateDesign.controller');

router.post('/grid', templateDesignController.getGridData);
router.get('/list', templateDesignController.getTemplateDesign);
router.post('/save-design', templateDesignController.createOrUpdateTemplateDesign);
router.delete('/delete-design', templateDesignController.deleteTemplateDesign);

module.exports = router;
