'use strict';

/**
 * Module dependencies.
 */
const _ = require('underscore'),
  path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs');

// Initialize Mongoose
module.exports.connect = function (callback) {
    mongoose.Promise = config.Promise
    let options = Object.assign({}, { useMongoClient: true });

    mongoose.connect(config.mongo.uri, options);
    mongoose.Promise = Promise;

    let db = mongoose.connection;
    db.on('error', function(error){
        console.log(`Error in mongo connection- ${error}`);
    });

    db.on('connected', function(){
        return callback()
    });
};

module.exports.disconnect = function (cb) {
  mongoose.connection.db
    .close(function (err) {
      console.info('Disconnected from MongoDB.');
    });
};
