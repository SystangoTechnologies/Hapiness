'use strict';

// Plugin for cookie based authentication.
exports.plugin = {  
    register: (server, options) => {
        server.auth.strategy('standard', 'cookie', {
            password: options.cookieSecret, // cookie secret
            cookie: options.cookieName, // Cookie name
            isSecure: false, // required for non-https applications
            clearInvalid: true,
            ttl: 24 * 60 * 60 * 1000, // Set session to 1 day
            redirectTo: '/'
        });

        // Blacklist all routes.
        server.auth.default({
            strategy: 'standard'
        });
    },
    name : 'auth',
    dependencies: ['context', 'hapi-auth-cookie', 'mongoose']
};