'use strict';

exports.notfound = {
    description: 'Fallback page for 404 error',
    handler: function(request, reply) {

        reply.view('errors/not-found').code(404);

    }
};
