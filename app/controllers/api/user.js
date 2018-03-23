'use strict';
const Joi = require('joi');
const UserHelper = require('../../helpers/user');

/* ================================== Controllers for V1 ============================== */


//get admin profile page
exports.getUserDetails = {
    description: 'Returns the dashboard',
    auth: 'jwt',
    handler: async (request, h) => {
        try {
            let userId = request.headers.userId;
            // Use helper method to defind service.
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


/* ================================== Controllers for V2 ============================== */
