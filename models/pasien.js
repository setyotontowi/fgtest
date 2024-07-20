const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Registration = require('./registration');

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

Pasien.associate = models => {
    Pasien.belongsTo(models.Kelurahan, {
        foreignKey: 'idKelurahan',
        as: 'kelurahan'
    })

    Pasien.hasMany(models.Registration, {
        foreignKey: 'idPasien',
        as: 'registrasi'
    });
}

module.exports = Pasien;