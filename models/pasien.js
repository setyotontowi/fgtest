const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Pasien = sequelize.define('Pasien', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: Sequelize.STRING,
    idKelurahan: {
        field: 'id_kelurahan',
        type: Sequelize.INTEGER,
    }
}, {
    tableName: 'dc_pasien',
    timestamps: false,
});

module.exports = Pasien;