'use strict';
exports.plugin = {  
    register: (plugin, options) => {
        const Controllers = {
            dashboard: {
                dashboard: require('../../controllers/web/dashboard/dashboard')
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
    },
    pkg: require('../../../package.json'),
    name : 'dashboard_routes'
};

