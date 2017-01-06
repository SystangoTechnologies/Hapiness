'use strict';

module.exports = {
    auth: {
        strategy: 'standard'
    },
    plugins: {
        crumb: {
            key: 'crumb',
            source: 'payload',
            restful: true
        }
    },
    handler: function(request, reply) {

        request.cookieAuth.clear();
        request.yar.flash('success', 'Logged out successfully');
        return reply.redirect('/login');

    }
};
