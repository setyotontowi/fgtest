const { desc } = require('drizzle-orm');
const { Pasien, Registration, Kelurahan, Kecamatan, Provinsi } = require('../models')
const { col, fn, Op, literal } = require('sequelize');

exports.registration = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const totalReg = await Registration.count()

        const rows = await Registration.findAll({
            attributes: [
                [col('pasien.kelurahan.id'), 'kelurahanId'],
                [col('pasien.kelurahan.nama'), 'kelurahanName'],
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
                        as: 'kecamatan'
                    }
                }
            },
            where: {
                regDate: {
                    [Op.lt]: new Date('2022-10-31'),
                    [Op.gt]: new Date('2022-01-01')
                }
            },
            group: ['pasien.kelurahan.nama'],
            order: [['total', 'DESC']],
        });

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addProvince = async (req, res) => {
    try {
        const { nama, kode } = req.body
        console.log(req.body)

        if (nama == null) {
            throw error
        }

        const prov = Provinsi.build({
            nama: nama,
            kode: kode
        })

        prov.save()

        res.status(201).json({
            message: 'New province added successfully',
            data: prov
        });;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}