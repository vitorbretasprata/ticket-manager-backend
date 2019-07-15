require('dotenv').config();
const compression = require('compression');
const express = require('express');
const app = express();
require('http').Server(app);

const bodyParser = require('body-parser');
const cors = require('cors');

var corsOptions = {
    origin: process.env.MAIN_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const port = process.env.PORT || 2000;

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/admin', require('./routes/admin'));

app.listen(port, () => {
    console.log(`Express listening on port ${port}...`)
});