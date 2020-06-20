"use strict"
//Required Modules
require('dotenv').config();

const express = require('express');
const app = express();
const compression = require('compression');
const helmet = require('helmet');

const routes = require('./routes/index');

// MiddleWares
app.use(helmet());
app.use(compression());

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// starting the app
const port = process.env.PORT;
app.listen(port);
console.log('app is running on port', port);

//connection to routes
app.get('/', (req, res)=>{
    res.send('Welcome to The League')
})

app.use('/api/v1',routes);

// Handle 404
app.use(function(req, res) {
    res.sendStatus(404)
})


//Handle Server Error
app.use(function(error, req, res, next) {
    res.sendStatus(500)
})

module.exports = app

