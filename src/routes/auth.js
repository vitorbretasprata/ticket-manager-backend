const routes = require('express').Router()
const controller = require('../controllers/authController');

routes.post('/register', controller.Register);
routes.post('/login',  controller.Login);
routes.put('/resetPassword', controller.resetPassword);
routes.post('/checkEmail', controller.checkEmail);

module.exports = routes;