'use strict';

exports.plugin = {  
    register: (plugin, options) => {
      
        const Controllers = {
            webapi: {
                users: require('../../controllers/web/user')
            }
        };
        plugin.route([
            {
                method: 'GET',
                path: '/profile',
                config: Controllers.webapi.users.showProfile
            },
            {
                method: 'POST',
                path: '/profile',
                config: Controllers.webapi.users.editProfile
            }
        ]);
    },
    pkg: require('../../../package.json'),
    name : 'api_routes'
};
