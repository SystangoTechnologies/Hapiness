'use strict';

// This plugin should be loaded after vision

const Hoek = require('hoek');

exports.plugin = {  
    register: (plugin, options) => {
        plugin.ext('onPreResponse', (request, h) =>
        {  
            try {
                if (request.yar && request.yar.flash && request.response.variety === 'view') {

                    var flash = request.yar.flash();
                    request.response.source.context = Hoek.applyToDefaults({
                        flash: flash
                    }, request.response.source.context);
                }
                return h.continue;
            } catch (error) {
                throw error;
            }
        });
    },
    pkg: require('../package.json'),
    name : 'flash',
    dependencies: ['vision']
};
