const express = require('express');
const controller = require('../controllers/registrationController');
const router = express.Router();

router.get('/registration/report', controller.registration)

module.exports = router
