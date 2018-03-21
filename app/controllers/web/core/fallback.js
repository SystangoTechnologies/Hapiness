'use strict';

exports.notfound = {
    description: 'Fallback page for 404 error',
    handler: async (request, h) => {
        return h.view('errors/not-found').code(404);
    }
};
