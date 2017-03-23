'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        webapi: {
            users: require('../controllers/users/user')
        }
    };

    plugin.route([

        {
            method: 'GET',
            path: '/setting',
            config: Controllers.webapi.users.setting
        },
        {
            method: 'POST',
            path: '/password',
            config: Controllers.webapi.users.changePassword
        },
        {
            method: 'GET',
            path: '/profile',
            config: Controllers.webapi.users.showProfile
        },
        {
            method: 'POST',
            path: '/profile',
            config: Controllers.webapi.users.editProfile
        },
        {
            method: 'GET',
            path: '/forgot',
            config: Controllers.webapi.users.showForgotPassword
        },
        {
            method: 'POST',
            path: '/forgot',
            config: Controllers.webapi.users.sendPasswordResetLink
        },
        {
            method: 'GET',
            path: '/reset/{token}',
            config: Controllers.webapi.users.showResetPassword
        },
        {
            method: 'POST',
            path: '/reset',
            config: Controllers.webapi.users.resetPassword
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'api_routes',
    version: require('../../package.json').version
};