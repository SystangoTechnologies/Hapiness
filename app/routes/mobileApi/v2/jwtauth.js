'use strict';

exports.plugin = {  
    register: (plugin, options) => {
        const Controllers = {
            auth: {
                loginv1: require('../../../controllers/api/v1/jwtlogin'),
                loginv2: require('../../../controllers/api/v2/jwtlogin')
            }
        };
        // Base path for mobile api for version 1
        const basePath = '/api/v2/';
        plugin.route([
            // JWT Auth Routes
            {
                method: 'POST',
                path: basePath+'login',
                config: Controllers.auth.loginv1.postCredentials
            }
        ]);
    
    },
    pkg: require('../../../../package.json'),
    name : 'jwtauth_routes_v2'
};
