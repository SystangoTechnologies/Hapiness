'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        dashboard: {
            dashboard: require('../controllers/dashboard/dashboard')
        }
    };

    plugin.route([

        // Dashboard Routes
        {
            method: 'GET',
            path: '/dashboard',
            config: Controllers.dashboard.dashboard.showDashboard
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'dashboard_routes',
    version: require('../../package.json').version
};
