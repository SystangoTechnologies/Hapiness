'use strict';

const Confidence = require('confidence');
const dbConfig = require('config').get('database.mongo.' + process.env.NODE_ENV);

// Confidence criteria 
let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};


//  Confidence document object

internals.config = {
    $meta: 'App configuration file',
    port: {
        web: {
            $filter: 'env',
            test: 9000,
            production: process.env.WEB_PORT,
            $default: 8000
        },
        api: {
            $filter: 'env',
            test: 9001,
            production: process.env.API_PORT,
            $default: 8001
        }
    },
    baseUrl: {
        $filter: 'env',
        $meta: 'values should not end in "/"',
        production: 'http://www.hapiness.com',
        $default: 'http://127.0.0.1:8000'
    },
    mongoose: {
        $filter: 'env',
        production: {
            uri: dbConfig.uri
        },
        test: {
            uri: dbConfig.uri
        },
        $default: {
            uri: dbConfig.uri,
            options: {}
        }
    },
    authCookie: {
        cookieSecret: process.env.COOKIE_SECRET,
        cookieName: 'Basic-auth'
    },
    yarCookie: {
        storeBlank: false,
        cookieOptions: {
            password: process.env.YAR_COOKIE_SECRET,
            isSecure: false
        }
    }, 
    jwtAuthOptions: {
        key: process.env.JWT_SECRET,
        algorithm: 'HS256'
    },
    good: {
        ops: {
        interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
};

internals.store = new Confidence.Store(internals.config);

exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};

exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
