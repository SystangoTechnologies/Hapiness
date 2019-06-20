'use strict';

const Hoek = require('hoek');

exports.plugin = {
	register: async (plugin, options) => {
		plugin.ext('onPreResponse', (request, h) => {
			try {
				var internals = {
					devEnv: (process.env.NODE_ENV === 'development'),
					meta: options.meta,
					credentials: request.auth.isAuthenticated ? request.auth.credentials : null
				};

				var response = request.response;
				if (response.variety && response.variety === 'view') {
					response.source.context = Hoek.merge(internals, request.response.source.context);
				}
				return h.continue;
			} catch (error) {
				throw error;
			}
		});
	},
	pkg: require('../package.json'),
	name: 'context'
};
