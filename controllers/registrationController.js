const { Pasien, Registration, Kelurahan, Kecamatan, Kabupaten } = require('../models')
const { col, fn, Op, literal } = require('sequelize');

exports.registration = async (req, res) => {
    try {
        const { startDate, endDate, region, parentRegionId, id } = req.query

        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        let offset = null
        let limit = null
        if (page) offset = (page - 1) * pageSize;
        if (pageSize) limit = pageSize;

        const currentYear = new Date().getFullYear();
        const start = startDate ? new Date(startDate) : new Date(currentYear, 0, 1);
        const end = endDate ? new Date(endDate) : new Date(currentYear, 11, 31);

        req.body.startDate = start
        req.body.endDate = end

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

        const totalReg = await Registration.count()

        const whereClause = {
            regDate: {
                [Op.lt]: end,
                [Op.gt]: start
            }
        };

        if (parentRegionId) {
            whereClause[`$${regional}.${regionalParent}.id$`] = parentRegionId;
        }

        if (id) {
            whereClause[`$${regional}.id$`] = id
        }

        const rows = await Registration.findAll({
            offset,
            limit,
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

exports.registrationReportKelurahan = async (req, res) => {
    try {
        req.query.region = "kelurahan"
        req.query.parentRegionId = req.query.kecamatanId

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.registrationReportKecamatan = async (req, res) => {
    try {
        req.query.region = "kecamatan"
        req.query.parentRegionId = req.query.kabupatenId

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.registrationReportKabupaten = async (req, res) => {
    try {
        req.query.region = "kabupaten"
        req.query.parentRegionId = req.query.provinsiId

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.registrationReportKelurahanId = async (req, res) => {
    try {
        req.query.region = "kelurahan"
        req.query.id = req.params.id

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.registrationReportKecamatanId = async (req, res) => {
    try {
        req.query.region = "kecamatan"
        req.query.id = req.params.id

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.registrationReportKabupatenId = async (req, res) => {
    try {
        req.query.region = "kabupaten"
        req.query.id = req.params.id

        this.registration(req, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}