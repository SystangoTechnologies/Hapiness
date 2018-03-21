'use strict';

exports.showDashboard = {
    description: 'Returns the dashboard',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: async (request, h) => {
        if (request.auth.isAuthenticated) {
           var userDetails = request.auth.credentials;
          return h.view('dashboard/dashboard', {user: userDetails});
        }else{
            return h.redirect('/login');
        }
    },
};