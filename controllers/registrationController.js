const { Pasien, Registration, Kelurahan, Kecamatan, Kabupaten } = require('../models')
const { col, fn, Op, literal } = require('sequelize');

exports.registration = async (req, res) => {
    try {
        const { startDate, endDate, region, id } = req.body

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        let regional = 'pasien.kelurahan'
        let regionalParent = 'kecamatan'
        switch (region) {
            case 'kecamatan': {
                regional = 'pasien.kelurahan.kecamatan';
                regionalParent = 'kabupaten'
                break;
            }
            case 'kabupaten': {
                regional = 'pasien.kelurahan.kecamatan.kabupaten';
                regionalParent = 'provinsi'
                break;
            }
        }

        console.log(`region ${region}`);

        const start = startDate ? new Date(startDate) : new Date(currentYear, 0, 1);
        const end = endDate ? new Date(endDate) : new Date(currentYear, 11, 31);

        const totalReg = await Registration.count()

        const whereClause = {
            regDate: {
                [Op.lt]: end,
                [Op.gt]: start
            }
        };

        if (id) {
            whereClause[`$${regional}.id_kecamatan$`] = id;
        }

        const rows = await Registration.findAll({
            attributes: [
                [col(`${regional}.id`), `${region}Id`],
                [col(`${regional}.nama`), `${region}Name`],
                [col(`id_${regionalParent}`), `${regionalParent}Id`],
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
                    attributes: ['nama', 'id', 'id_kecamatan'],
                    include: {
                        model: Kecamatan,
                        attributes: ['nama', 'id', 'id_kabupaten'],
                        as: 'kecamatan',
                        include: {
                            model: Kabupaten,
                            attributes: ['nama', 'id', 'id_provinsi'],
                            as: 'kabupaten'
                        },

                    }
                }
            },
            where: whereClause,
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