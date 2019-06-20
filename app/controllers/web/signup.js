'use strict';

const Joi = require('joi');
const signupHelper = require('../../helpers/signup');

exports.showForm = {
	description: 'Returns the signup page',
	auth: {
		mode: 'try',
		strategy: 'standard'
	},
	handler: (request, h) => {
		if (request.auth.isAuthenticated) {
			var userDetails = request.auth.credentials;
			return h.redirect('/dashboard', {user: userDetails});
		}
		return h.view('auth/signup');
	}
};

exports.postForm = {
	description: 'Submit the signup page',
	auth: {
		mode: 'try',
		strategy: 'standard'
	},
	validate: {
		payload: {
			name: Joi.string().required(),
			password: Joi.string().min(6).max(20).required(),
			verify: Joi.string().required(),
			email: Joi.string().email().required()
		},
		failAction: (request, h, error) => {
			// Boom bad request
			console.log('Validation Failed');
			request.yar.flash('error', error.details[0].message.replace(/['"]+/g, ''));
			return h.redirect('/signup').takeover();
		}
	},
	handler: async (request, h) => {
		try {

			if (request.auth.isAuthenticated) {
				// Redirect to dashboard if already logged in.
				return h.redirect('/dashboard');
			}
			if (request.payload.password !== request.payload.verify) {
				// password did not match
				request.yar.flash('error', 'Password does not match');
				return h.redirect('/signup');
			}
			// Although Joi does not allow any extra parameter.
			// This is just to safe check any dev/human error.
			var user = {
				name: request.payload.name,
				password: request.payload.password,
				email: request.payload.email
			};
			// Then save the user
			let data = await signupHelper.signUpUser(user);
			if (data.statusCode === 201) {
				request.cookieAuth.set(data.user);
				return h.redirect('/dashboard');
			} else {
				request.yar.flash('error', data.message);
				return h.redirect('/signup');
			}
		} catch (error) {
			if (error.code === 11000) {
				console.log('Email already exists.');
				request.yar.flash('error', 'Email already exists.');
			} else {
				// Boom bad implementation
				console.log('An internal server error occurred');
				request.yar.flash('error', error.message);
			}
			return h.redirect('/signup');
		}
	}
};
