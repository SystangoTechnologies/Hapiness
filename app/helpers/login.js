'use strict';
const Mongoose = require('mongoose');
const User = Mongoose.model('User');

/**
 * Find user and check crednetials.
 */
exports.findByCredentials = async function (username, password) {
	return new Promise(async function (resolve, reject) {
		try {
			var query = {};
			if (username.indexOf('@') > -1) {
				query.email = username.toLowerCase();
			} else {
				query.username = username.toLowerCase();
			}
			let user = await User.findOne(query);
			if (!user || !user.authenticate(password)) {
				return resolve({
					statusCode: 401,
					message: 'Invalid username or password'
				});
			}
			return resolve({
				statusCode: 200,
				user: user
			});
		} catch (error) {
			return reject(error);
		}
	});
};
