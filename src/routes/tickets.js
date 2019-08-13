const { validateJWT } = require('../middlewares/validateJWT');
const routes = require('express').Router()
const controller = require('../controllers/ticketController');

routes.get('/getTickets' , validateJWT, controller.requestTickets);
routes.get('/getTicket/:id' , validateJWT, controller.requestTicket);
routes.post('/createTicket' , validateJWT, controller.createTicket);
routes.put('/addComment/:id' , validateJWT, controller.addComment);
routes.post('/filter' , validateJWT, controller.Filter);
routes.delete('/deleteTicket/:id' , validateJWT, controller.deleteTicket);
routes.put('/editTicket/:id' , validateJWT, controller.editTicket);
routes.get('/getInfo', validateJWT, controller.requestInfo);


module.exports = routes