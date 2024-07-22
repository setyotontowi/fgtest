const { Sql } = require('sequelize');

exports.reportAllByKabupatenId = async (req, res) => {
    try {

        res.status('200');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
