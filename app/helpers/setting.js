'use strict';
const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Crypto = require('crypto');

/**
 * Update password of user.
 */
exports.updatePassword = (request, oldPwd, newPwd) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await User.findOne({
				email: request.auth.credentials.email
			});
			if (!user || !user.authenticate(oldPwd)) {
				return resolve({
					statusCode: 401,
					message: 'incorrect current password'
				});
			} else {
				// save new password
				user.password = newPwd;
				let savedData = await user.save();
				return resolve({
					statusCode: 200,
					user: savedData,
					message: 'Password changed successfully'
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * Method to generate reset password token.
 */
exports.generateResetPasswordToken = async (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await User.findOne({
				email: email
			});
			if (!user) {
				return reject('No  User Exists for Given Email');
			} else {
				var token = Crypto.randomBytes(20).toString('hex');
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				await user.save();
				return resolve({
					to: email,
					token: token
				});
			}
		} catch (error) {
			return reject(error);
		}
	});
};

/**
 * Method to reset forgot password.
 */
exports.resetForgotPassword = async (request, newPassword, token) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await User.findOne({
				resetPasswordToken: token
			});
			if (!user) {
				return reject('Invalid Token');
			} else {
				var expireTime = user.resetPasswordExpires;
				var currentTime = Date.now();
				if (currentTime > expireTime) {
					return reject('Reset password link expired.');
				} else {
					// save new password
					user.password = newPassword;
					user.resetPasswordToken = null;
					user.resetPasswordExpires = null;
					await user.save();
					return resolve('Password updated successfully');
				}
			}
		} catch (error) {
			return reject(error.message);
		}
	});
};
