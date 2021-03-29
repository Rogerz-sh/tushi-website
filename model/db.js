const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // autoReconnect: true,
    poolSize: 5
});

//连接成功
mongoose.connection.on('connected', function () {
    console.log('info', 'Mongoose Success open to ' + config.DB_URL, 'DB.js');
});

//连接失败
mongoose.connection.on('error', function (error) {
    console.log('info', 'Mongoose failed open to' + config.DB_URL + ' reason:' + error, 'DB.js');
});

//连接断开
mongoose.connection.on('disconnected', function (err) {
    console.log('info', 'Mongoose disconnected', 'DB.js');
});


module.exports = mongoose;