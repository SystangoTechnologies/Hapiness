'use strict';

// This plugin should be loaded after vision

const Hoek = require('hoek');

exports.register = function(plugin, options, next) {

    // To Do : Raise an eror if yar plugin is already loaded
    // To Do : Raise an error if vision is not loaded

    plugin.ext('onPreResponse', function(request, reply) {

        if (request.yar && request.yar.flash && request.response.variety === 'view') {

            var flash = request.yar.flash();
            request.response.source.context = Hoek.applyToDefaults({
                flash: flash
            }, request.response.source.context);
        }
        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    name: 'flash',
    dependencies: ['vision']
};
