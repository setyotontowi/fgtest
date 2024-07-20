const express = require('express');
const router = express.Router();
const patientRoutes = require('./pasienRoute');
const registrationRoutes = require('./registrationRoute')

router.use(patientRoutes);
router.use(registrationRoutes);

module.exports = router;