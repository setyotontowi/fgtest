const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Kabupaten = require('./kabupaten');

const Kecamatan = sequelize.define('Kecamatan', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: Sequelize.STRING,
    idKabupaten: {
        field: 'id_kabupaten',
        type: Sequelize.INTEGER,

    },
    kode: Sequelize.INTEGER
}, {
    tableName: 'dc_kecamatan',
    timestamps: false,
});

Kecamatan.belongsTo(Kabupaten, {
    foreignKey: 'id_kabupaten',
    as: 'kabupaten'
});

module.exports = Kecamatan;