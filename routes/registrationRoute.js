const express = require('express');
const controller = require('../controllers/registrationController');
const router = express.Router();

router.get('/registration/report', controller.registration)
router.get('/registration/report/kabupaten/:id', controller.registrationReportKabupatenId)
router.get('/registration/report/kabupaten', controller.registrationReportKabupaten)
router.get('/registration/report/kecamatan/:id', controller.registrationReportKecamatanId)
router.get('/registration/report/kecamatan/', controller.registrationReportKecamatan)
router.get('/registration/report/kelurahan/:id', controller.registrationReportKelurahanId)
router.get('/registration/report/kelurahan', controller.registrationReportKelurahan)
router.get('/registration/report/all/kecamatan', controller.registrationReportKecamatanAll)
router.get('/registration/report/all/kabupaten', controller.registrationReportKabupatenAll)

module.exports = router
