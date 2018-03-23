'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Meta = require('./meta');
const Pack = require('../package');

let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};

internals.manifest = {
    $meta: 'App manifest document',
    server: {
        host : process.env.SERVER_HOST,
        port: 8000
    },
    register: {
        plugins : [
               //**************************************************************
        //                                                             *
        //                      COMMON PLUGINS                         *
        //                                                             *
        //**************************************************************

        // //  App context decorator
        {
            plugin: './lib/context',
            options: {
                meta: Meta.get('/')
            }
        },
        // Email connector 
        {
            plugin: './lib/email',
            options: Config.get('/email')
        },
        //  MongoDB connector 
        {
            plugin : './lib/mongoose',
            options: Config.get('/mongoose')
            
        },
        // //  Logging connector 
        {
            plugin:  'good',
            options: Config.get('/good')
        },

        // //**************************************************************
        // //                                                             *
        // //                      WEB PLUGINS                            *
        // //                                                             *
        // //**************************************************************
        // // Cookie authentication
        {
            plugin: 'hapi-auth-cookie',
            options: {
                select: ['web'] 
            }
        },
        //  Crumb
        {
            plugin:'crumb',
                options: {
                    cookieOptions: {
                        isSecure: false
                    },
                    skip: function(request, reply) {
                        // to disable it for the save-email method
                        if (request.path && request.path.indexOf('/api/') > -1) {
                            return true;
                        }
                    }
            }
        },
        // Static file and directory handlers
        {
            plugin: 'inert'
        },
        {
            plugin: 'vision'
        },
        // Swagger support 
        {
            plugin: 'hapi-swagger',
            options: {
                    info: {
                        title: 'Test API Documentation',
                        version: Pack.version,
                    },
                    host: process.env.SWAGGER_HOST,
                    securityDefinitions: {
                        'jwt': {
                            'type': 'apiKey',
                            'name': 'Authorization',
                            'in': 'header'
                        }
                    },
                    security: [{ 'jwt': [] }]
                }
        },
        // // Views loader 
       
        // Flash Plugin
        {
            plugin: './lib/flash'
        },
        // Hapi cookie jar
        {
            plugin: 'yar',
            options: Config.get('/yarCookie')
        },
        //  Authentication strategy
        {
            plugin: './lib/auth',
            options: Config.get('/authCookie')
        },

        // //**************************************************************
        // //                                                             *
        // //                      API PLUGINS                            *
        // //                                                             *
        // //**************************************************************

        // JWT authentication
        {
            plugin: 'hapi-auth-jwt2',
        },
        //  JWT-Authentication strategy
        {
            plugin:  './lib/jwtAuth',
            options: Config.get('/jwtAuthOptions')
        },
    
        // //**************************************************************
        // //                                                             *
        // //                      APPLICATION ROUTES                     *
        // //                                                             *
        // //**************************************************************
        
        /* ----------------- Start web api routes -------------- */
        {
            plugin: './app/routes/webApi/core.js'
        },
        //  Auth routes
        {
            plugin: './app/routes/webApi/auth.js'
        },
        //  Dashboard routes
        {
            plugin: './app/routes/webApi/dashboard.js'
        },
        // web end routes.
        {
            plugin: './app/routes/webApi/web.js'
        },
        {
            plugin: './app/routes/webApi/setting.js'
        },
        /* ----------------- End web apiroutes  -------------- */

        /* ----------------- Start mobile api routes -------------- */
            /* Version v1 apis */
        {
            plugin: './app/routes/mobileApi/v1/jwtauth.js'
        },
           /* Version v2 apis */
        {
            plugin: './app/routes/mobileApi/v2/jwtauth.js'
        },
        {
            plugin: './app/routes/mobileApi/v1/user.js'
        },
        {
            plugin: './app/routes/mobileApi/v2/user.js'
        }
        /* ----------------- End mobile api routes -------------- */

        ]
    }
};

internals.store = new Confidence.Store(internals.manifest);

exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};
exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
