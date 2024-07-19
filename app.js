const express = require('express');
const Sequelize = require('sequelize');
const sequelize = require('./config/database'); // Path to your Sequelize configuration file
const Pasien = require('./models/pasien');
const routes = require('./routes');
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
app.use('/api', routes);


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});