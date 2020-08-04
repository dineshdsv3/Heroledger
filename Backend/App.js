const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
var server = http.Server(app);
var io = (module.exports.io = require('socket.io')(server));
// const SocketManager = require('./socket/SocketManager');
// io.on('connection', SocketManager);

const port = process.env.PORT || 4000;

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});