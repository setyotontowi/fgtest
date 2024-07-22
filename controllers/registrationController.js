const { Pasien, Registration, Kelurahan, Kecamatan, Kabupaten } = require('../models')
const { col, fn, Op, literal, where } = require('sequelize');

exports.registration = async (req, res) => {
    try {

        const rows = await fetchData(req)

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

exports.registrationReportKecamatanAll = async (req, res) => {
    try {
        req.query.region = "kecamatan"
        req.query.parentRegionId = req.query.kabupatenId
        req.query.page = req.query.page ? req.query.page : 1
        req.query.pageSize = req.query.pageSize ? req.query.pageSize : 5

        const kecamatan = await fetchData(req)

        let data = []

        for (const k of kecamatan) {
            const idKecamatan = k.dataValues.kecamatanId
            const item = {
                id: idKecamatan,
                kecamatanName: k.dataValues.kecamatanName,
                kabupatenId: k.dataValues.kabupatenId,
                total: k.dataValues.total,
                percentage: k.dataValues.percentage,
                kelurahan: []
            };

            if (idKecamatan) {
                req.query.region = "kelurahan";
                req.query.idKecamatan = idKecamatan;
                req.query.page = null;
                req.query.pageSize = null;

                const kelurahan = await fetchData(req);

                const dataKelurahan = []
                for (const l of kelurahan) {
                    const jenisPoli = await fetchJenisPoli(l.dataValues.kelurahanId)

                    const k = {
                        kelurahanId: l.dataValues.kelurahanId,
                        kelurahanName: l.dataValues.kelurahanName,
                        percentage: l.dataValues.percentage,
                        poliklinik: jenisPoli['poliklinik'],
                        igd: jenisPoli['igd'],
                        total: l.dataValues.total,
                    };
                    dataKelurahan.push(k)
                }
                item.kelurahan = dataKelurahan
            }

            data.push(item);
        }

        res.json(data)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.registrationReportKabupatenAll = async (req, res) => {
    try {
        // fetch data
        req.query.region = "kabupaten"
        req.query.parentRegionId = req.query.provinsiId
        req.query.page = req.query.page ? req.query.page : 1
        req.query.pageSize = req.query.pageSize ? req.query.pageSize : 5

        const kabupaten = await fetchData(req)

        let data = []

        for (const k of kabupaten) {
            const idKabupaten = k.dataValues.kabupatenId
            const item = {
                id: idKabupaten,
                kabupatenName: k.dataValues.kabupatenName,
                kabupatenId: k.dataValues.kabupatenId,
                total: k.dataValues.total,
                percentage: k.dataValues.percentage,
                kecamatan: []
            };

            if (idKabupaten) {
                req.query.region = "kecamatan";
                req.query.idKabupaten = idKabupaten;
                req.query.page = null;
                req.query.pageSize = null;

                const kecamatan = await fetchData(req);

                item.kecamatan = kecamatan.map(l => ({
                    kecamatanId: l.dataValues.kecamatanId,
                    kecamatanName: l.dataValues.kecamatanName,
                    total: l.dataValues.total,
                    percentage: l.dataValues.percentage
                }));
            }

            data.push(item);
        }

        res.json(data)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.registrationReportKecamatanAllId = async (req, res) => {
    try {
        req.query.region = "kecamatan"
        req.query.id = req.params.id
        req.query.page = req.query.page ? req.query.page : 1
        req.query.pageSize = req.query.pageSize ? req.query.pageSize : 5

        const kecamatan = await fetchData(req)

        let data = []

        for (const k of kecamatan) {
            const idKecamatan = k.dataValues.kecamatanId
            const item = {
                id: idKecamatan,
                kecamatanName: k.dataValues.kecamatanName,
                kabupatenId: k.dataValues.kabupatenId,
                total: k.dataValues.total,
                percentage: k.dataValues.percentage,
                kelurahan: []
            };

            if (idKecamatan) {
                req.query.region = "kelurahan";
                req.query.idKecamatan = idKecamatan;
                req.query.id = null;
                req.query.page = null;
                req.query.pageSize = null;

                const kelurahan = await fetchData(req);

                const dataKelurahan = []
                for (const l of kelurahan) {

                    const jenisPoli = await fetchJenisPoli(l.dataValues.kelurahanId)

                    const k = {
                        kelurahanId: l.dataValues.kelurahanId,
                        kelurahanName: l.dataValues.kelurahanName,
                        percentage: l.dataValues.percentage,
                        poliklinik: jenisPoli['poliklinik'],
                        igd: jenisPoli['igd'],
                        total: l.dataValues.total,
                    };
                    dataKelurahan.push(k)
                }

                item.kelurahan = dataKelurahan
            }

            data.push(item);
        }

        res.json(data)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.registrationReportKabupatenAllId = async (req, res) => {
    try {
        req.query.region = "kabupaten"
        req.query.id = req.params.id

        const kabupaten = await fetchData(req)

        let data = []

        for (const k of kabupaten) {
            const idKabupaten = k.dataValues.kabupatenId
            const item = {
                id: idKabupaten,
                kabupatenName: k.dataValues.kabupatenName,
                kabupatenId: k.dataValues.kabupatenId,
                total: k.dataValues.total,
                percentage: k.dataValues.percentage,
                kecamatan: []
            };

            if (idKabupaten) {
                req.query.region = "kecamatan";
                req.query.idKabupaten = idKabupaten;
                req.query.id = null;
                req.query.page = null;
                req.query.pageSize = null;

                const kecamatan = await fetchData(req);

                item.kecamatan = kecamatan.map(l => ({
                    kecamatanId: l.dataValues.kecamatanId,
                    kecamatanName: l.dataValues.kecamatanName,
                    total: l.dataValues.total,
                    percentage: l.dataValues.percentage
                }));
            }

            data.push(item);
        }

        return rows

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function fetchData(req) {
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
        having: [{
            total: {
                [Op.gt]: 0
            }
        }],
        group: [`${regional}.nama`],
        order: [['total', 'DESC']],
    });

    return rows
}

async function fetchJenisPoli(idKelurahan) {
    try {
        const rows = await Registration.findAll({
            attributes: [
                'jenis',
                [fn('COUNT', '*'), 'total']
            ],
            include: {
                model: Pasien,
                as: 'pasien',
                attributes: [],
                include: {
                    model: Kelurahan,
                    attributes: [],
                    as: 'kelurahan'
                }
            },
            where: {
                [`$pasien->kelurahan.id$`]: idKelurahan
            },
            group: 'jenis'
        });

        const map = {}
        for (const item of rows) {
            if (item.dataValues['jenis'] == 'Poliklinik') {
                map['poliklinik'] = item.dataValues['total'] ? item.dataValues['total'] : 0
            } else if (item.dataValues['jenis'] == 'IGD') {
                map['igd'] = item.dataValues['total'] ? item.dataValues['total'] : 0
            }
        }

        return map

    } catch (error) {
        console.error(error);
    }
}