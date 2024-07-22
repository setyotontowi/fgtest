const { col, fn } = require('sequelize');
const { Pasien, Kelurahan, Kecamatan } = require('../models');

exports.getPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await Pasien.findAndCountAll({
            offset,
            limit,
            include: {
                model: Kelurahan,
                attributes: ['nama'],
                as: 'kelurahan',
                include: {
                    model: Kecamatan,
                    attributes: ['nama'],
                    as: 'kecamatan'
                }
            },

        });

        const totalPages = Math.ceil(count / pageSize);

        res.json({
            data: rows.map(patient => ({
                id: patient.id,
                name: patient.nama,
                kelurahan: patient.kelurahan ? patient.kelurahan.nama : null,
                kecamatan: patient.kelurahan?.kecamatan ? patient.kelurahan.kecamatan.nama : null,
            })),
            meta: {
                totalItems: count,
                totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.patientOrigin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const rows = await Pasien.findAll({
            offset,
            limit,
            attributes: [
                [fn('COUNT', '*'), 'total']
            ],
            include: [{
                model: Kelurahan,
                attributes: ['nama'],
                as: 'kelurahan'
            }],
            group: 'kelurahan.nama',
        })

        console.log(rows)

        res.json({
            data: rows.map(data => ({
                'kelurahan': data.kelurahan?.nama ? data.kelurahan.nama : null,
                'total': data.dataValues.total ? data.dataValues.total : 0
            })),
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

exports.addPatient = async (req, res) => {
    try {
        const { nama, idKelurahan } = req.body

        const row = Pasien.build({
            nama: nama,
            idKelurahan: idKelurahan
        })

        row.save();

        res.status(201).json({
            message: 'Patient added successfully',
            data: row
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}