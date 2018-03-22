'use strict';
const Mongoose = require('mongoose');
const Joi = require('joi');
const User = Mongoose.model('User');

exports.connect = function(provider) {
    // Return config object for hapi route
    return {
        auth: provider,
        handler: async (request, h) => {
            try {
                if (!request.auth.isAuthenticated) {
                    request.yar.flash('success', 'Authentication failed due to: ' + request.auth.error.message);
                    return h.redirect('/me/settings/networks');
                }
                // If user is signed in then connect existing account with provider
                if (request.state['Basic-auth']) {
                    delete request.auth.credentials.profile;
                    delete request.auth.credentials.query;
                    var id = request.state['Basic-auth']._id.toString();
                    var update = {
                        $set: {}
                    };
                    update.$set['networks.' + provider] = request.auth.credentials;
                    var options = {
                        new: true
                    };
                    let user = await User.findByIdAndUpdate(id, update, options);
                    // Reset the session
                    request.cookieAuth.clear();
                    request.cookieAuth.set(user);
                    request.yar.flash('success', 'Profile successfully saved');
                   return h.redirect('/me/settings/networks');   
                }
            } catch (error) {
                request.yar.flash('error', 'An internal server error occurred');
                return h.redirect('/me/settings/networks');
            }
        }
    };
};

exports.disconnect = {
    handler: async (request, h) => {
       try {
        var provider = encodeURIComponent(request.params.provider);
        var id = request.auth.credentials._id.toString();
        var update = {
            $unset: {}
        };
        update.$unset['networks.' + provider] = '';
        var options = {
            new: true
        };
        let user = await User.findByIdAndUpdate(id, update, options);
        // Reset the session
        request.cookieAuth.clear();
        request.cookieAuth.set(user);
        request.yar.flash('success', 'Account successfully disconnected');
        return h.redirect('/me/settings/networks');           
       } catch (error) {
        request.yar.flash('error', 'An internal server error occurred');
        return h.redirect('/me/settings/networks');
       }
    }
};
