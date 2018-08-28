'use strict';

const express = require('express'),
    app = express(),
    fs = require('fs'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    mongoose = require('./server/helpers/mongoose'),
    path = require('path');

/**
* Globally define the application config variables
**/
global.config = require('./server/config/');

//globally set the express-joi variable
global.expressJoi = require('./server/helpers/joiValidation');



const httpProtocol = require("http");

/**
* Decrease the size of the response body to increase the speed of a web application.
**/
app.use(compression());

/**
* Allow headers for cross domain.
**/
app.use((req, res, next) => {
    const allowOrigin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    next();
});

// move this to helper files
mongoose.connect(() => {
  console.log("Connected to mongoDB");
})
/**
* Initialize post data parsing.
**/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
* Initialize the router.
**/

app.use(require('./server/controllers/'));

/**
* Default handler for invalid API endpoint.
**/
app.all('*', (req, res) => {
    res.status(global.config.default_not_found_http_code).json({"responseCode" : global.config.default_not_found_http_code});
});

/**
* Default handler for uncaught exception error.
**/
app.use((err, req, res, next) => {
    console.error("UUID=" + res._headers['x-request-id'], "UncaughtException is encountered", "Error=" + err, "Stacktrace=" + err.stack);
    let response = {"responseCode" : global.config.default_error_code, "responseDesc" : err.name};
    if (res.headersSent) {
        clearInterval(req.timer);
        response = JSON.stringify(response);
        response = response.replace(/^({)/, "");
        return res.end('",' + response);
    }
    res.status(global.config.default_error_code).json(response);
});

/**
* start express server.
**/
let httpServer = httpProtocol.createServer(app);

/**
* Server start port.
**/
httpServer.listen(global.config.appPort, () => {
    console.log(`Server started on ${global.config.environmentName.charAt(0).toUpperCase() + global.config.environmentName.slice(1)} server started at port ${global.config.appPort}`);
});
