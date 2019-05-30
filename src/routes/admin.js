const { validateJWT } = require('../middlewares/validateJWT');
const routes = require('express').Router()
const controller = require('../controllers/adminController');

routes.get('/getUsers' , validateJWT, controller.requestUsers);
routes.get('/getUsers/:id' , validateJWT, controller.requestUser);
routes.post('/addUser' , validateJWT, controller.createUser);
routes.put('/editUser' , validateJWT, controller.editUser);
routes.post('/filter' , validateJWT, controller.Filter);
routes.delete('/deleteUser/:id' , validateJWT, controller.deleteUser);

module.exports = routes