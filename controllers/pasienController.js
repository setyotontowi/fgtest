const Patient = require('../models/pasien');
const Kelurahan = require('../models/city/kelurahan');

exports.getPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await Patient.findAndCountAll({
            offset,
            limit,
            include: {
                model: Kelurahan,
                attributes: ['nama'],
                as: 'kelurahan',
            },
        });

        const totalPages = Math.ceil(count / pageSize);

        res.json({
            data: rows.map(patient => ({
                id: patient.id,
                name: patient.nama,
                city: patient.kelurahan ? patient.kelurahan.nama : null,
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