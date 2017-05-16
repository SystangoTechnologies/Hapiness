'use strict';

exports.showDashboard = {
    description: 'Returns the dashboard',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {

        if (request.auth.isAuthenticated) {
            var userDetails = request.auth.credentials;
            reply.view('dashboard/dashboard', {user: userDetails});
        }
    },
    tags: ['api'] //swagger documentation
};