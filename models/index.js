const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Pasien = require('./pasien');
const Registration = require('./registration');
const Kelurahan = require('./city/kelurahan');

const models = {
    Pasien,
    Registration,
    Kelurahan,
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;