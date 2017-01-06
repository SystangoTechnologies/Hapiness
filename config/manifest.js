'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Meta = require('./meta');


let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};

internals.manifest = {
    $meta: 'App manifest document',
    server: {
        connections: {
            router: {
                stripTrailingSlash: true,
                isCaseSensitive: false
            },
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    },{
        port: Config.get('/port/api'),
        labels: ['api']
    }],
    registrations: [

        //**************************************************************
        //                                                             *
        //                      COMMON PLUGINS                         *
        //                                                             *
        //**************************************************************

        //  App context decorator
        {
            plugin: {
                register: './lib/context',
                options: {
                    meta: Meta.get('/')
                }
            }
        },
        //  MongoDB connector 
        {
            plugin: {
                register: './lib/mongoose',
                options: Config.get('/mongoose')
            }
        },
        //  Logging connector 
        {
            plugin: {
                register: 'good',
                options: Config.get('/good')
            }
        },

        //**************************************************************
        //                                                             *
        //                      WEB PLUGINS                            *
        //                                                             *
        //**************************************************************
        // Cookie authentication
        {
            plugin: 'hapi-auth-cookie',
            options: {
                select: ['web'] 
            }
        },
        //  Crumb
        {
            plugin: {
                register: 'crumb',
                options: {
                    cookieOptions: {
                        isSecure: false
                    }
                }
            },
            options: {
                select: ['web'] 
            }
        },
        // Static file and directory handlers
        {
            plugin: 'inert',
            options: {
                select: ['web'] 
            }
        },
        // Templates rendering support 
        {
            plugin: 'vision',
            options: {
                select: ['web'] 
            }
        },
        // Swagger support 
        {
            plugin: 'hapi-swagger',
            options: {
                select: ['web'] 
            }
        },
        // Views loader 
        {
            plugin: {
                register: 'visionary',
                options: {
                    engines: {
                        hbs: 'handlebars'
                    },
                    path: './app/templates',
                    layoutPath: './app/templates/layouts',
                    helpersPath: './app/templates/helpers',
                    partialsPath: './app/templates/partials',
                    layout: 'default'
                }
            },
            options: {
                select: ['web'] 
            }
        },
        // Flash Plugin
        {
            plugin: {
                register: './lib/flash'
            },
            options: {
                select: ['web'] 
            }
        },
        // Hapi cookie jar
        {
            plugin: {
                register: 'yar',
                options: Config.get('/yarCookie')
            },
            options: {
                select: ['web'] 
            }
        },
        //  Authentication strategy
        {
            plugin: {
                register: './lib/auth',
                options: Config.get('/authCookie')
            },
            options: {
                select: ['web'] 
            }
        },

        //**************************************************************
        //                                                             *
        //                      API PLUGINS                            *
        //                                                             *
        //**************************************************************

        // JWT authentication
        {
            plugin: 'hapi-auth-jwt2',
            options: {
                select: ['api'] 
            }
        },
        //  JWT-Authentication strategy
        {
            plugin: {
                register: './lib/jwtAuth',
                options: Config.get('/jwtAuthOptions')
            },
            options: {
                select: ['api'] 
            }
        },
    
        //**************************************************************
        //                                                             *
        //                      APPLICATION ROUTES                     *
        //                                                             *
        //**************************************************************

        //  Core routes
        {
            plugin: './app/routes/core.js'
        },
        //  Auth routes
        {
            plugin: './app/routes/auth.js',
            options: {
                select: ['web'] 
            }
        },
        //  Dashboard routes
        {
            plugin: './app/routes/dashboard.js',
            options: {
                select: ['web']
            }
        },
        //  Auth routes
        {
            plugin: './app/routes/jwtauth.js',
            options: {
                select: ['api'] 
            }
        }
    ]
};

internals.store = new Confidence.Store(internals.manifest);

exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};
exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
