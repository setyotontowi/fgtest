const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Pasien = require('../pasien');

const Kelurahan = sequelize.define('Kelurahan', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: Sequelize.STRING,
    idKecamatan: {
        field: 'id_kecamatan',
        type: Sequelize.INTEGER,
    },
    kode: Sequelize.INTEGER,
}, {
    tableName: 'dc_kelurahan',
    timestamps: false,
});


module.exports = Kelurahan;