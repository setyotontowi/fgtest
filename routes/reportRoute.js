const express = require('express');
const controller = require('../controllers/reportController');
const router = express.Router();

router.get('/report/registration/all/kabupaten/:id', controller.reportAllByKabupatenId)

module.exports = router