"use strict"
//Required Modules
require('dotenv').config();

const express = require('express');
const app = express();
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const {UserRoutes, FixtureRoutes, TeamsRoutes} = require('./routes/');
const { sendResponse } = require('./helpers/ResponseHelper');

// MiddleWares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// starting the app
const port = process.env.PORT;
app.listen(port);
console.log('app is running on port', port);

//connection to routes
app.get('/', (req, res) => {
    res.send('Welcome to The League')
})



app.use('/api/v1', UserRoutes, FixtureRoutes, TeamsRoutes);

// Handle 404
app.use(function (req, res) {
    sendResponse(res, 404);
})


//Handle Server Error
app.use(function (error, req, res, next) {
    console.log(error)
    sendResponse(res, 500);
})

module.exports = app

