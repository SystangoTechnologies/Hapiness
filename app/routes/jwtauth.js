'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        auth: {
            login: require('../controllers/auth/jwtlogin')
        }
    };

    plugin.route([
        // JWT Auth Routes
        {
            method: 'POST',
            path: '/login',
            config: Controllers.auth.login.postCredentials
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'jwtauth_routes',
    version: require('../../package.json').version
};
