const { validateJWT } = require('../middlewares/validateJWT');
const { validatePrivileges } = require('../middlewares/validatePrivileges')
const routes = require('express').Router()
const controller = require('../controllers/adminController');

routes.get('/getUsers' , [validateJWT, validatePrivileges], controller.requestUsers);
routes.get('/getUsers/:id' , [validateJWT, validatePrivileges], controller.requestUser);
routes.post('/addUser' , [validateJWT, validatePrivileges], controller.createUser);
routes.put('/editUser' , [validateJWT, validatePrivileges], controller.editUser);
routes.post('/filter' , [validateJWT, validatePrivileges], controller.Filter);
routes.delete('/deleteUser/:id' , [validateJWT, validatePrivileges], controller.deleteUser);

module.exports = routes