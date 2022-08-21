// config env  
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoClient = require('mongoose');

const userRouter = require('./routes/user');
const app = express();

// setup connect mongodb by mongoose server
mongoClient.connect('mongodb://localhost/nodejsapistarter', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected database success from mongodb.'))
    .catch(() => console.error(`Connectd databse is failes with error which is ${error}`))

//Middleware
app.use(logger('dev'));
app.use(bodyParser.json())

//Routes 
app.use('/users', userRouter);


// Catch 404 the Errors and forward them to error handlers
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err);
})

//Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    //response to client 
    return res.status(status).json({
        error:{
            message: error.message
        }
    })
})

// Start the server
const port = app.get('port') || 3000
app.listen(port, () => console.log(`sever is listening on port ${port}`))