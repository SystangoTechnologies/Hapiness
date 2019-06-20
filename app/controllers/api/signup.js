'use strict';
var JWT = require('jsonwebtoken');
const Joi = require('joi');
const Config = require('../../../config/config');
const signupHelper = require('../../helpers/signup');

/* ================================== Controllers for V1 ============================== */

// validate user login.
exports.userSignUp = {
	description: 'Sign up api',
	auth: false,
	validate: {
		payload: {
			email: Joi.string().min(3).email().required(),
			password: Joi.string().min(5).required(),
			confirmPassword: Joi.string().min(5).required(),
			name: Joi.string().required()
		},
		failAction: (request, h, error) => {
			// Username, passowrd minimum validation failed
			return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
		}
	},
	handler: async (request, h) => {
		try {
			// Method define in helper and used by both web and api.
			let password = request.payload.password;
			let confirmPassword = request.payload.confirmPassword;
			let email = request.payload.email;
			let name = request.payload.name;
			if (password !== confirmPassword) {
				return h.response({ message: 'Password does not match' }).code(401);
			}
			let user = {
				email: email,
				name: name,
				password: password
			};
			let data = await signupHelper.signUpUser(user);
			if (data.statusCode === 201) {
				let secret = Config.get('/jwtAuthOptions/key');
				let obj = {
					userId: data.user.id
				}; // object info you want to sign
				let jwtToken = JWT.sign(obj, secret, { expiresIn: '1 day' });
				data.user.password = undefined;
				data.user.salt = undefined;
				var response = h.response({ message: data.message, user: data.user });
				response.header('Authorization', jwtToken);
				response.code(201);
				return response;
			} else {
				// User not found in database
				return h.response({ message: data.message }).code(data.statusCode);
			}
		} catch (error) {
			return error.message;
		}
	},
	tags: ['api'] // swagger documentation
};

/* ================================== Controllers for V2 ============================== */
