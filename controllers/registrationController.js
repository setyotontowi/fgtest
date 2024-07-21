const { Pasien, Registration, Kelurahan, Kecamatan, Kabupaten } = require('../models')
const { col, fn, Op, literal } = require('sequelize');

exports.registration = async (req, res) => {
    try {
        const { startDate, endDate, region } = req.body

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        let regional = 'pasien.kelurahan.nama'
        switch (region) {
            case 'kecamatan': { regional = 'pasien.kelurahan.kecamatan'; break; }
            case 'kabupaten': { regional = 'pasien.kelurahan.kecamatan.kabupaten'; break; }
        }

        const start = startDate ? new Date(startDate) : new Date(currentYear, 0, 1);
        const end = endDate ? new Date(endDate) : new Date(currentYear, 11, 31);

        const totalReg = await Registration.count()

        const rows = await Registration.findAll({
            attributes: [
                [col(`${regional}.id`), `${region}Id`],
                [col(`${regional}.nama`), `${region}Name`],
                [fn('COUNT', '*'), 'total'],
                [literal(`COUNT(*) / ${totalReg} * 100`), 'percentage']
            ],
            include: {
                model: Pasien,
                attributes: [],
                as: 'pasien',
                include: {
                    model: Kelurahan,
                    as: 'kelurahan',
                    attributes: ['nama'],
                    include: {
                        model: Kecamatan,
                        attributes: ['nama'],
                        as: 'kecamatan',
                        include: {
                            model: Kabupaten,
                            attributes: ['nama'],
                            as: 'kabupaten'
                        },

                    }
                }
            },
            where: {
                regDate: {
                    [Op.lt]: new Date(end),
                    [Op.gt]: new Date(start)
                }
            },
            group: [`${regional}.nama`],
            order: [['total', 'DESC']],
        });

        res.json({
            'data': rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};