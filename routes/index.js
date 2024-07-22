const express = require('express');
const router = express.Router();
const patientRoutes = require('./pasienRoute');
const registrationRoutes = require('./registrationRoute')
const reportRoutes = require('./reportRoute')

router.use(patientRoutes);
router.use(registrationRoutes);
router.use(reportRoutes);

module.exports = router;