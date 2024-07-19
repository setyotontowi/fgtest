const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

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

module.exports = Kecamatan;