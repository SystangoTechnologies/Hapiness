'use strict';

exports.register = function(plugin, options, next) {

    var Controllers = {
        core: {
            fallback: require('../controllers/core/fallback'),
            static: require('../controllers/core/static')
        }
    };

    plugin.route([

        // Static Routes
        {
            method: 'GET',
            path: '/css/{path*}',
            config: {
                auth: false
            },
            handler: Controllers.core.static.css
        }, {
            method: 'GET',
            path: '/images/{path*}',
            config: {
                auth: false
            },
            handler: Controllers.core.static.img
        }, {
            method: 'GET',
            path: '/js/{path*}',
            config: {
                auth: false
            },
            handler: Controllers.core.static.js
        }, {
            method: 'GET',
            path: '/fonts/{path*}',
            config: {
                auth: false
            },
            handler: Controllers.core.static.fonts
        }, {
            method: 'GET',
            path: '/favicon.ico',
            config: {
                auth: false
            },
            handler: Controllers.core.static.favicon
        }, {
            method: 'GET',
            path: '/heartbeat',
            config: Controllers.core.static.heartbeat
        }, {
            method: '*',
            path: '/{p*}',
            config: Controllers.core.fallback.notfound
        }

    ]);

    next();
};

exports.register.attributes = {
    name: 'core_routes',
    version: require('../../package.json').version
};
