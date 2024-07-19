const express = require('express');
const router = express.Router();
const patientRoutes = require('./pasienRoute');


router.use(patientRoutes);

module.exports = router;