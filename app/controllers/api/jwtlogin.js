'use strict';
var Boom = require('boom');
var JWT   = require('jsonwebtoken');
const Joi = require('joi');
const Config = require('../../../config/config');
const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const loginHelper = require('../../helpers/login');

/* ================================== Controllers for V1 ============================== */

// validate user login.
exports.postCredentials = {
    description: 'jwt login',
    auth : false,
    validate: {
        payload: {
            email: Joi.string().min(3).email().required(),
            password: Joi.string().min(5).required()
        },
         failAction: (request, h, error) => {
            // Username, passowrd minimum validation failed
            return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
        }
    },
    handler: async (request, h) => {
          try {
            // Method define in helper and used by both web and api.
            let data = await loginHelper.findByCredentials(request.payload.email, request.payload.password);
            if (data.statusCode === 200) {
                let secret = Config.get('/jwtAuthOptions/key');
                let obj = {
                    userId : data.user.id
                }; // object info you want to sign
                let jwtToken = JWT.sign(obj, secret, { expiresIn: '1 day' });
                data.user.password = undefined;
                data.user.salt = undefined;
                var response = h.response({ message : 'Successfully login', user : data.user });
                response.header('Authorization', jwtToken);
                response.code(200);
                return response;
            } else {
                // User not found in database
                return h.response({ message: data.message }).code(data.statusCode);
            }              
          } catch (error) {
             return error.message;
          }  
    },
    tags: ['api'] //swagger documentation
};


/* ================================== Controllers for V2 ============================== */
