'use strict';
const Joi = require('joi');
const UserHelper = require('../../../helpers/user');

//get admin profile page
exports.getUserDetails = {
    description: 'Returns the dashboard',
    auth: 'jwt',
    handler: async (request, h) => {
        try {
            let userId = request.headers.userId;
            let userDetails = await UserHelper.findUserDetails(userId);
            return h.response({
                userDetails: userDetails
            }).code(200);
        } catch (error) {
            return error.message;
        }
    },
    tags: ['api'] //swagger documentation
};