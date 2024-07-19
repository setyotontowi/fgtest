const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Provinsi = sequelize.define('Provinsi', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: Sequelize.STRING,
    kode: Sequelize.INTEGER
}, {
    tableName: 'dc_Provinsi',
    timestamps: false,
});

module.exports = Provinsi;