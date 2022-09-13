const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database.url, config.database.options);

mongoose.connection.on('connected', async () => {
    console.log('[+] Connected to database!');
});