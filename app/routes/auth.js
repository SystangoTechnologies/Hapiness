'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        auth: {
            login: require('../controllers/auth/login'),
            signup: require('../controllers/auth/signup'),
            logout: require('../controllers/auth/logout'),
            networks: require('../controllers/auth/networks')
        }
    };

    plugin.route([
        // Auth Routes
        {
            method: 'GET',
            path: '/',
            config: Controllers.auth.login.showForm
        }, {
            method: 'POST',
            path: '/',
            config: Controllers.auth.login.postForm
        }, {
            method: 'GET',
            path: '/login',
            config: Controllers.auth.login.showForm
        }, {
            method: 'POST',
            path: '/login',
            config: Controllers.auth.login.postForm
        }, {
            method: 'GET',
            path: '/signup',
            config: Controllers.auth.signup.showForm
        }, {
            method: 'POST',
            path: '/signup',
            config: Controllers.auth.signup.postForm
        }, {
            method: '*',
            path: '/logout',
            config: Controllers.auth.logout
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'auth_routes',
    version: require('../../package.json').version
};
