'use strict';

exports.plugin = {
	register: (plugin, options) => {
		const Controllers = {
			auth: {
				login: require('../../../controllers/api/jwtlogin')
			}
		};
		// Base path for mobile api for version 1
		const basePath = '/api/v2/';
		plugin.route([
			// JWT Auth Routes
			{
				method: 'POST',
				path: basePath+'login',
				config: Controllers.auth.login.postCredentials
			}
		]);

	},
	pkg: require('../../../../package.json'),
	name: 'jwtauth_routes_v2'
};
