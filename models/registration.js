const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Kelurahan = require('./city/kelurahan');
const Pasien = require('./pasien')

const Registration = sequelize.define('Registration', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    noRegister: {
        field: 'no_register',
        type: Sequelize.INTEGER,
    },
    idPasien: {
        field: 'id_pasien',
        type: Sequelize.INTEGER,
        references: {
            model: 'dc_pasien',
            key: 'id'
        }
    },
    regDate: {
        field: 'waktu_daftar',
        type: Sequelize.DATE
    },
    outDate: {
        field: 'waktu_keluar',
        type: Sequelize.DATE
    },
    jenis: Sequelize.STRING,
    jenisIgd: {
        field: 'jenis_igd',
        type: Sequelize.STRING
    },
    status: Sequelize.STRING,
    langsung: Sequelize.STRING
}, {
    tableName: 'dc_pendaftaran',
    timestamps: false,
});

Registration.belongsTo(Pasien, {
    foreignKey: 'id_pasien',
    as: 'pasien', // Alias for the city association
});

module.exports = Pasien;