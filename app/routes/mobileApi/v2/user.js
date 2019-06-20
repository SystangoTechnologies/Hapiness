'use strict';

exports.plugin = {
	register: (plugin, options) => {
		const Controllers = {
			user: {
				user: require('../../../controllers/api/user')
			}
		};
		// Base path for mobile api for version 1
		const basePath = '/api/v2/';
		plugin.route([
			{
				method: 'GET',
				path: basePath+'userDetails',
				config: Controllers.user.user.getUserDetails
			}
		]);

	},
	pkg: require('../../../../package.json'),
	name: 'user_routes_v2'
};
