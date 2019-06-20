'use strict';

exports.plugin = {
	register: (plugin, options) => {
		const Controllers = {
			auth: {
				signup: require('../../../controllers/api/signup')
			}
		};
		// Base path for mobile api for version 1
		const basePath = '/api/v2/';
		plugin.route([
			// JWT Auth Routes
			{
				method: 'POST',
				path: basePath+'signUp',
				config: Controllers.auth.signup.userSignUp
			}
		]);

	},
	pkg: require('../../../../package.json'),
	name: 'signup_routes_v2'
};
