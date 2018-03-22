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
    handler: async (request, h) => {
        request.cookieAuth.clear();
        request.yar.flash('success', 'Logged out successfully');
        return h.redirect('/login');
    }
};
