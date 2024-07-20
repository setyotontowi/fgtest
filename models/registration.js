const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pasien = require('./pasien');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    noRegister: {
        field: 'no_register',
        type: DataTypes.INTEGER,
    },
    idPasien: {
        field: 'id_pasien',
        type: DataTypes.INTEGER,
        references: {
            model: 'Pasien',
            key: 'id'
        }
    },
    regDate: {
        field: 'waktu_daftar',
        type: DataTypes.DATE
    },
    outDate: {
        field: 'waktu_keluar',
        type: DataTypes.DATE
    },
    jenis: DataTypes.STRING,
    jenisIgd: {
        field: 'jenis_igd',
        type: DataTypes.STRING
    },
    status: DataTypes.STRING,
    langsung: DataTypes.STRING
}, {
    tableName: 'dc_pendaftaran',
    timestamps: false,
});

Registration.associate = (models) => {
    Registration.belongsTo(models.Pasien, {
        foreignKey: 'id_pasien',
        as: 'pasien',
    });
};

module.exports = Registration;