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
require('./db/db');

const userRouter = require('./Routers/routes');

app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// app.use(express.static(staticFilesPath));

app.use(express.json());
app.use(userRouter);

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
