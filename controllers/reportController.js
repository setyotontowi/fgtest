const sequelize = require('../config/database');

exports.reportAllByKabupatenId = async (req, res) => {
    try {
        const { id } = req.params
        const { startDate, endDate, tipe, kategori } = req.query

        const result = {
            "status": "OK"
        }

        result['parameter'] = await parameter(startDate, endDate, id, tipe, kategori)

        const percentArea = await percentage('kabupaten', id, startDate, endDate)
        result['presentase_wilayah'] = percentArea.map(item => ({
            'nama': item.nama,
            'percentage': parseFloat(item.percentage).toFixed(2) + " %"
        }))

        result['sub_rawat_jalan'] = await subRawatJalan('kabupaten', id, startDate, endDate)
        result['sub_area_data'] = await subAreaData('kabupaten', id, startDate, endDate, percentArea)

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
        let query = "SELECT jenis, COUNT(dc_pendaftaran.id) as total FROM dc_pendaftaran" +
            " JOIN dc_pasien on dc_pendaftaran.id_pasien = dc_pasien.id" +
            " JOIN dc_kelurahan on dc_pasien.id_kelurahan = dc_kelurahan.id"

        query += " JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
        query += " JOIN dc_kabupaten on dc_kecamatan.id_kabupaten = dc_kabupaten.id"
        query += ` WHERE dc_kabupaten.id = ${id}`
        query += ` AND dc_pendaftaran.waktu_daftar > ${startDate}`
        query += ` AND dc_pendaftaran.waktu_daftar < ${endDate}`
        query += " GROUP BY jenis"

        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

    } catch (error) {
        console.error(error)
    }
}

async function percentage(area, id, startDate, endDate) {
    try {

        // Count Total
        let query = "SELECT COUNT(dc_pendaftaran.id) as total FROM dc_pendaftaran" +
            " INNER JOIN dc_pasien on dc_pendaftaran.id_pasien = dc_pasien.id" +
            " INNER JOIN dc_kelurahan on dc_pasien.id_kelurahan = dc_kelurahan.id"

        switch (area) {
            case "kecamatan": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += ` WHERE dc_kecamatan.id = ${id}`
                query += ` AND dc_pendaftaran.waktu_daftar >= ${startDate}`
                query += ` AND dc_pendaftaran.waktu_daftar <= ${endDate}`
                query += " GROUP BY dc_kecamatan.id"
            }
            case "kabupaten": {
                query += " INNER JOIN dc_kecamatan on dc_kelurahan.id_kecamatan = dc_kecamatan.id"
                query += " INNER JOIN dc_kabupaten on dc_kecamatan.id_kabupaten = dc_kabupaten.id"
                query += ` WHERE dc_kabupaten.id = ${id}`
                query += ` AND dc_pendaftaran.waktu_daftar >= ${startDate}`
                query += ` AND dc_pendaftaran.waktu_daftar <= ${endDate}`
                query += " GROUP BY dc_kabupaten.id"
            }
        }

        console.log(query)

        const total = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

        const t = total[0] ? total[0].total : 0

        // Count Percentage
        query = `SELECT dc_kecamatan.id, dc_kecamatan.nama, COUNT(dc_pendaftaran.id) as total, COALESCE(COUNT(dc_pendaftaran.id)/${t}*100, 0) as percentage FROM dc_kecamatan` +
            " LEFT JOIN dc_kelurahan on dc_kelurahan.id_kecamatan = dc_kecamatan.id" +
            " LEFT JOIN dc_pasien on dc_pasien.id_kelurahan = dc_kelurahan.id" +
            " LEFT JOIN dc_pendaftaran on dc_pendaftaran.id_pasien = dc_pasien.id " +
            " INNER JOIN dc_kabupaten ON dc_kecamatan.id_kabupaten = dc_kabupaten.id " +
            ` WHERE dc_kabupaten.id = ${id}` +
            ` AND dc_pendaftaran.waktu_daftar >= ${startDate}` +
            ` AND dc_pendaftaran.waktu_daftar <= ${endDate}` +
            " GROUP BY dc_kecamatan.nama" +
            " HAVING total > 0"

        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })

    } catch (error) {
        console.error(error)
    }
}

async function subAreaData(area, id, startDate, endDate, areaData) {
    try {
        const result = []

        let show = true

        for (const kecamatan of areaData) {
            const data = {
                "area": kecamatan.nama,
                "total": kecamatan.total
            }

            const id = kecamatan.id
            const query = "SELECT dc_kelurahan.nama, COUNT(dc_pendaftaran.id) as total, " +
                " CAST(SUM(CASE WHEN dc_pendaftaran.jenis = 'igd' THEN 1 ELSE 0 END) AS INTEGER) AS igd," +
                " CAST(SUM(CASE WHEN dc_pendaftaran.jenis = 'poliklinik' THEN 1 ELSE 0 END) AS INTEGER) AS poliklinik" +
                " FROM dc_kecamatan" +
                " LEFT JOIN dc_kelurahan ON dc_kecamatan.id = dc_kelurahan.id_kecamatan" +
                " LEFT JOIN dc_pasien ON dc_kelurahan.id = dc_pasien.id_kelurahan" +
                " LEFT JOIN dc_pendaftaran ON dc_pasien.id = dc_pendaftaran.id_pasien" +
                " INNER JOIN dc_kabupaten ON dc_kecamatan.id_kabupaten = dc_kabupaten.id" +
                ` WHERE dc_kecamatan.id = ${id}` +
                ` AND dc_pendaftaran.waktu_daftar >= ${startDate} AND dc_pendaftaran.waktu_daftar <= ${endDate}` +
                " GROUP BY dc_kelurahan.id" +
                " HAVING total > 0"

            data["sub_area"] = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            })

            result.push(data)

            if (show) console.log(query); show = false
        }

        return result

    } catch (error) {
        console.error(error)
    }
}