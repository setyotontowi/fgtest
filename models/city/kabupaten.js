const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Kabupaten = sequelize.define('Kabupaten', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: Sequelize.STRING,
    idProvinsi: {
        field: 'id_provinsi',
        type: Sequelize.INTEGER,
    },
    kode: Sequelize.INTEGER
}, {
    tableName: 'dc_kabupaten',
    timestamps: false,
});

module.exports = Kabupaten;