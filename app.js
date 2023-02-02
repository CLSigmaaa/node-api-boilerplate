// Import libraries
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const jsonErrorHandler = require('./src/middlewares/jsonErrorHandler');
const checkAuth = require('./src/middlewares/check-authentication');
require('dotenv').config()

// Const variables
const app = express();
const port = process.env.API_PORT;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/src/logs/requests.log', { flags: 'a' });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jsonErrorHandler);
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/users', require('./src/routes/users'));
app.use('/api', require('./src/routes/auth'));

// Start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
