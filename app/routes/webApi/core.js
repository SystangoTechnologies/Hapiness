'use strict';

exports.plugin = {  
    register: (plugin, options) => {
       
    var Controllers = {
        core: {
            fallback: require('../../controllers/web/core/fallback'),
            static: require('../../controllers/web/core/static')
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
    },
    pkg: require('../../../package.json'),
    name : 'core_routes'
};
