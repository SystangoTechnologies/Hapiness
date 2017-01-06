'use strict';

exports.showDashboard = {
    description: 'Returns the dashboard',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {

        if (request.auth.isAuthenticated) {
            reply.view('dashboard/dashboard');
        }
    },
    tags: ['api'] //swagger documentation
};