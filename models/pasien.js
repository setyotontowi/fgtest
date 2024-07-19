const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Kelurahan = require('./city/kelurahan');

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
        references: {
            model: 'dc_kelurahan',
            key: 'id'
        }
    }
}, {
    tableName: 'dc_pasien',
    timestamps: false,
});

Pasien.belongsTo(Kelurahan, {
    foreignKey: 'id_kelurahan',
    as: 'kelurahan', // Alias for the city association
});

module.exports = Pasien;