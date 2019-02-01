const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')


const server = express();

var corsOptions = {
    origin: 'https://ticketmanaget-front.herokuapp.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const auth = require('./controllers/authController')
const tickets = require('./controllers/ticketController')
const userDB = require('./models/user')
const ticketDB = require('./models/ticket')
const config = require('./config/config')

const port = process.env.PORT || 2000;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors(corsOptions));


server.use('/api/auth', auth);
server.use('/api/tickets', tickets);

server.listen(port, () => {
    console.log(`Express listening on port ${port}...`)
});