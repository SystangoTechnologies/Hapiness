'use strict';

const Mongoose = require('mongoose');
exports.plugin = {
	register: async (server, options) => {
		server.auth.strategy('jwt', 'jwt', {
			key: options.key,
			validate: validate, // validate function defined above
			verifyOptions: {
				algorithms: options.algorithm
			}
			// Uncomment this to apply default auth to all routes
			// plugin.auth.default('jwt');
		});
	},
	name: 'jwt-auth'
};

// bring your own validation function
const validate = async (decoded, request) => {
	const User = Mongoose.model('User');
	try {
		// do your checks to see if the person is valid
		let userId = decoded.userId;
		// Set user id in every request header.
		request.headers.userId = userId;
		let user = await User.findOne({
			_id: Mongoose.Types.ObjectId(userId)
		});
		if (user) {
			return {
				isValid: true
			};
		} else {
			console.log('Invalid Credential');
			return {
				isValid: false
			};
		}
	} catch (error) {
		return {
			isValid: false
		};
	}
};
