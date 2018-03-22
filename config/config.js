'use strict';

const Confidence = require('confidence');
const Fs = require('fs');
const Path = require('path');

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
    tlsOptions: {
        key: Fs.readFileSync(Path.join(__dirname, 'ssl/key.pem'), 'utf8'),
        cert: Fs.readFileSync(Path.join(__dirname, 'ssl/cert.pem'), 'utf8')
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
            uri: process.env.DATABASE_URL
        },
        test: {
            uri: process.env.DATABASE_URL
        },
        $default: {
            uri: process.env.DATABASE_URL   ,
            options: {}
        }
    },
    email: {
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT,
        email: process.env.GMAIL_ID,
        password: process.env.GMAIL_PASSWORD,
        senderEmail: process.env.GMAIL_SENDEREMAIL,
        senderName : process.env.GMAIL_SENDERNAME
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
            }, 'stdout'],
            myFileReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ error: '*', response: '*',log : '*',  request: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: ['./logs/log']
            }],
            myHTTPReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ error: '*' }]
            }, {
                module: 'good-http',
                args: ['http://localhost:8000/logs', {
                    wreck: {
                        headers: { 'x-api-key': 12345 }
                    }
                }]
            }]
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
