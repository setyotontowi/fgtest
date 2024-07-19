const express = require('express');
const Sequelize = require('sequelize');
const sequelize = require('./config/database'); // Path to your Sequelize configuration file
const Pasien = require('./models/pasien');
require('dotenv').config();

const app = express();

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Your other Express app configurations and routes
// ...


app.use(express.json());

app.get('/pasien', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await Pasien.findAndCountAll({
            offset,
            limit,
        });

        const totalPages = Math.ceil(count / pageSize);

        res.json({
            data: rows,
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
});


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});