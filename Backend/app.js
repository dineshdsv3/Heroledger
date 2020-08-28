const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
var server = http.Server(app);
const userRouter = require('./routers/user')
const port = process.env.PORT
require('./db/db')


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})