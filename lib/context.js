'use strict';

const Hoek = require('hoek');

exports.register = function(plugin, options, next) {

    plugin.ext('onPreResponse', function(request, reply) {
        var internals = {
            devEnv: (process.env.NODE_ENV === 'development'),
            meta: options.meta,
            credentials: request.auth.isAuthenticated ? request.auth.credentials : null
        };

        var response = request.response;
        if (response.variety && response.variety === 'view') {
            response.source.context = Hoek.merge(internals, request.response.source.context);

        }
        return reply.continue();
    });

    next();
};


exports.register.attributes = {
    name: 'context',
    version: require('../package.json').version
};
