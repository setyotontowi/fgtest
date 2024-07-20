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

Kecamatan.associate = (models) => {
    Kecamatan.belongsTo(models.Kabupaten, {
        foreignKey: 'id_kabupaten',
        as: 'kabupaten'
    });

    Kecamatan.hasMany(models.Kelurahan, {
        foreignKey: 'id_kecamatan',
    });
}

module.exports = Kecamatan;