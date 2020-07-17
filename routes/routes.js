const express = require('express');
const transactionRouter = express.Router();
const service = require ('../services/transactionService.js') ;


transactionRouter.post('/create/', service.create);
transactionRouter.get('/list/:yearMonth', service.findAll);
transactionRouter.get('/find/:id', service.findOne);
transactionRouter.put('/update/:id', service.update);
transactionRouter.delete('/delete/:id', service.remove);


module.exports = transactionRouter;






