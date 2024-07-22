const express = require('express');
const controller = require('../controllers/pasienController');
const router = express.Router();

// Define patient-related routes here
router.get('/pasien', controller.getPatients)
router.get('/asal_pasien', controller.patientOrigin)
router.post('/pasien/add', controller.addPatient)

module.exports = router;