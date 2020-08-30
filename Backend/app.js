const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
var server = http.Server(app);
const userRouter = require('./routers/user')
const port = process.env.PORT
const path = require('path')
require('./db/db')
const staticFilesPath = path.join(process.cwd(), 'build');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json())
app.use(express.static(staticFilesPath));
app.use(userRouter)

app.use(function (req, res) {
	res.sendFile(path.join(staticFilesPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})