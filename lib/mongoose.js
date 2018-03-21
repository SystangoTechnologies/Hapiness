'use strict';

const Mongoose = require('mongoose');
const Glob = require('glob');

exports.plugin = {  
    register: (plugin, options) => {
        Mongoose.connect(options.uri, function(err) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    
    
        // When the connection is connected
        
        Mongoose.connection.on('connected', function() {
            console.log('Mongo Database connected');
        });
    
    
        // When the connection is disconnected
        
        Mongoose.connection.on('disconnected', function() {
            console.log(' Mongo Database disconnected');
        });
    
    
        // If the node process ends, close the mongoose connection 
        
        process.on('SIGINT', function() {
            Mongoose.connection.close(function() {
                console.log('Mongo Database disconnected through app termination');
                process.exit(0);
            });
        });
    
        // Load models 
        var models = Glob.sync('app/models/*.js');
        models.forEach(function(model) {
            require('../' + model);
        });
    
    },
    pkg: require('../package.json'),
    name : 'mongoose'
};
