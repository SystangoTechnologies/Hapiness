'use strict';

const Hoek = require('hoek');
const Manifest = require('./config/manifest');
const Glue = require('glue');
const Handlebars = require('handlebars');

const composeOptions = {
    relativeTo: __dirname
};

async function startServer () {
    try {
        var server = await Glue.compose(Manifest.get('/'), composeOptions);
        server.views({
            engines: {
                hbs: Handlebars
            },
            path: './app/templates',
            layoutPath: './app/templates/layouts',
            helpersPath: './app/templates/helpers',
            partialsPath: './app/templates/partials',
            layout: 'default'
        });
        await server.start();
        console.info(`Server started at ${ server.info.uri }`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startServer();
