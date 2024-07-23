const sequelize = require('../config/database');

exports.reportAllByKabupatenId = async (req, res) => {
    try {
        const { id } = req.params
        const { startDate, endDate, tipe, kategori } = req.query

        const result = {
            "status": "OK"
        }

        result['parameter'] = await parameter(startDate, endDate, id, tipe, kategori)
        result['presentase_wilayah'] = await percentage('kabupaten', id)
        result['sub_rawat_jalan'] = await subRawatJalan('kabupaten', id)

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function parameter(startDate, endDate, id, tipe, kategori) {
    try {
        const kabupaten = await sequelize.query(`SELECT nama FROM dc_kabupaten WHERE id=${id}`, {
            type: sequelize.QueryTypes.SELECT
        })

        const start = new Date(startDate);
        const end = new Date(endDate)
        const options = { day: 'numeric', month: 'long', year: 'numeric' };

        const startDateInd = start.toLocaleDateString('id-ID', options);
        const endDateInd = end.toLocaleDateString('id-ID', options)

        const data = {
            "tipe": tipe,
            "date": startDateInd + " s.d " + endDateInd,
            "kabupaten": kabupaten[0].nama,
            "kategori": kategori
        }

        return data

    } catch (error) {
        console.error(error)
    }
}

async function subRawatJalan(area, id, startDate, endDate) {
    try {
        let query = "SELECT jenis, COUNT(*) as total FROM dc_pendaftaran" +
            " JOIN dc_pasien on dc_pendaftaran.id_pasien = dc_pasien.id" +
            " JOIN dc_kelurahan on dc_pasien.id_kelurahan = dc_kelurahan.id"

        query += " JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
        query += " JOIN dc_kabupaten on dc_kecamatan.id_kabupaten = dc_kabupaten.id"
        query += ` WHERE dc_kabupaten.id = ${id}`
        query += " GROUP BY jenis"

        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

    } catch (error) {
        console.error(error)
    }
}

async function percentage(area, id) {
    try {

        // Count Total
        let query = "SELECT COUNT(*) as total FROM dc_pendaftaran" +
            " INNER JOIN dc_pasien on dc_pendaftaran.id_pasien = dc_pasien.id" +
            " INNER JOIN dc_kelurahan on dc_pasien.id_kelurahan = dc_kelurahan.id"

        switch (area) {
            case "kecamatan": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += ` WHERE dc_kecamatan.id = ${id}`
                query += " GROUP BY dc_kecamatan.id"
            }
            case "kabupaten": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += " INNER JOIN dc_kabupaten on dc_kecamatan.id_kabupaten = dc_kabupaten.id"
                query += ` WHERE dc_kabupaten.id = ${id}`
                query += " GROUP BY dc_kabupaten.id"
            }
        }

        const total = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

        const t = total[0].total

        // Count Percentage
        query = `SELECT dc_kecamatan.nama, COUNT(*)/${t}*100 as percentage FROM dc_pendaftaran` +
            " INNER JOIN dc_pasien on dc_pendaftaran.id_pasien = dc_pasien.id" +
            " INNER JOIN dc_kelurahan on dc_pasien.id_kelurahan = dc_kelurahan.id"

        switch (area) {
            case "kecamatan": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += ` WHERE dc_kecamatan.id = ${id}`
                query += " GROUP BY dc_kelurahan.id"
            }
            case "kabupaten": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += " INNER JOIN dc_kabupaten on dc_kecamatan.id_kabupaten = dc_kabupaten.id"
                query += ` WHERE dc_kabupaten.id = ${id}`
                query += " GROUP BY dc_kecamatan.id"
            }
        }


        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

    } catch (error) {
        console.error(error)
    }
}
