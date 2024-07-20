const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

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
        references: {
            model: 'Kecamatan',
            key: 'id'
        }
    },
    kode: Sequelize.INTEGER,
}, {
    tableName: 'dc_kelurahan',
    timestamps: false,
});

Kelurahan.associate = (models) => {
    Kelurahan.belongsTo(models.Kecamatan, {
        foreignKey: 'id_kecamatan',
        as: 'kecamatan'
    });

    Kelurahan.hasMany(models.Pasien, {
        foreignKey: 'idKelurahan',
    })
}


module.exports = Kelurahan;