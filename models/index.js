const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Pasien = require('./pasien');
const Registration = require('./registration');
const Kelurahan = require('./city/kelurahan');
const Kecamatan = require('./city/kecamatan');
const Kabupaten = require('./city/kabupaten');

const models = {
    Pasien,
    Registration,
    Kelurahan,
    Kecamatan,
    Kabupaten
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;