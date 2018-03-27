![Hapiness](https://github.com/sytango-technologies/Hapiness/blob/master/assets/images/logo2.png)

## Hapiness
Production ready Hapi boilerplate application.

## Description
'Hapiness' boilerplate application serves as a great starting point for all the Hapi.js developers who were looking for a platform for their production server.

1) localhost:8000 - Serve web request <br />
2) localhost:8000/api - Serve rest api request

WEB and RESTAPI both have their independent authentication mechanisms, the web application uses the cookie based authentication and the RESTAPI uses the JWT authentication for access. The deployment and application management is done via 'Gulp' and there are different configurations/tasks for starting the app in the development vs the production environment. This application assumes the availability of 'MongoDB' installation on the localhost where the server will run.

The app contains basic user management with login, logout, password reset, profile view.
Forgot password implementation is done using 'nodemailer' (sends an email with reset password link with a unique token that expires in 1 hour).

For production, we have used 'PM2' as the process manager which spawns 4 servers for the application and takes care of the rest of application life cycle management. All the environment variables are managed using 'dotenv' node package for development, the same will need to be configured at the host server in the production environment.

If you are using 'Chrome' for unit testing the application, you can Hapi-ly use the 'node-inspector' chrome plugin pre-configured with this app for debugging purposes.

## SSL Support
SSL support has been provided using self signed certificates. Users may replace the certificates placed at config/ssl directory with their proprietary certificates.
The SSL support can be suppressed by commenting out the following lines in config/manifest.js : 
```
tls: Config.get('/tlsOptions')
```

## Nodemailer Configuration
User may replace their gmail credentials in the .env file for debugging purpose on local environment.
However, for production the credentials should be set as environment variables.


## Technology

- **Hapi** - Server side framework
- **Docker** - Docker container support
- **Handlebar** - HTML templating engine
- **Mongoose** - Mongo database ORM
- **SASS** - CSS preprocessor 
- **Gulp** - Javascript tasks automation
- **WebPack** - Asset pipeline
- **Dotenv** - Environment variable emulator
- **Good** - Logger mechanism
- **JWT** - Authentication mechanism for APIs
- **Config** - Configuration Handler
- **PM2** - Production process manager for Node.js apps
- **Nodemailer** - Module to send emails
- **Mocha** - Unit test framework


## Application Structure
```
├── app
│   ├── controllers
│   │   ├── api            // Controllers are organised by module names for rest api 
│   │   └── web            // Controllers are organised by module names for web api.
│   ├── helpers            // Helpers contains methods that are access by both api and                                web controllers.
│   ├── models             // All mongoose models are defined here
│   ├── routes             // All app routes are defined here
│   │   ├── mobileApi      // RESTAPI routes for multiple versions V1 & V2.
│   │   │   ├── v1         // Routes for version1
│   │   │   └── v2         // Routes for version2
│   │   └── webApi         // WEB api routes.
│   └── templates          // All server-rendered handlebar templates, partials and                                helpers
├── assets                 // Contains all static resources 
│   ├── fonts              // Fonts used in application
│   ├── images             // Images used in application
│   ├── scripts            // Scripts used in application
│   │   ├── js             // User defined scripts
│   │   └── vendor         // Vendor scripts.
│   └── styles             // All SASS stylesheets
├──config                  // Contains all app configurations
│   ├── assets.js          // Assets configuration file
│   ├── config.js          // Application configuration. 
│   ├── default.json       // Configuration file.
│   ├── manifest.js        // App manifest file listing all plugins and load order.
│   ├── meta.js            // App metadata file.
│   └── ssl                // Contains ssl certificates
├── lib                    // Core application lib/plugins
├── logs                   // Contains app log file 
└── tasks                  // Contains all gulp tasks
├──.gitignore              // standard git ignore file
├──.babelrc                // Babel config
├──.eslintrc               // Define eslint rules.
├──.eslintignore           // Ignores certain files for eslint rules
├──Dockerfile              // Standard doceker file
├──docker-compose.yml      // Standard docker compose file 
├──gulpfile.js             // Gulp entry file 
├──server.js               // Contains all app configurations
├──.env                    // dotenv configuration file for environment variable 
└── test
    ├── testcases          // Testcases organised by module names.
    └── test.js            // Test file.

```

## Code

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). All client-side js code is also in commonJS pattern packs using webpack. Check out `.eslintrc` for additional code conventions used.

## .env Configuration
To simulate environment variables in Dev environment, please create .env file at the root location and define the following properties -

```
DEBUGGER=false                                      // Enable/disable debug mode
NODE_ENV=development                                // Node environment development/production
PORT=8000                                           // Server Port
SERVER_HOST=0.0.0.0                                 // Hapi Server host
COOKIE_SECRET=This_Should_be_32_characters_long
YAR_COOKIE_SECRET=This_Should_be_32_characters_long
JWT_SECRET=This_Should_be_32_characters_long
GMAIL_ID=Sender's Gmail Id
GMAIL_PASSWORD=Gmail password
GMAIL_SENDEREMAIL=Display email id for sender       // Could be same or different than GMAIL_ID
GMAIL_SENDERNAME=Sender's name to display in email
MAIL_HOST=smtp.gmail.com                            // Mail host
MAIL_PORT=465                                       // Mail Port
DATABASE_URL=mongodb://localhost:27017/hapiness     // Mongo database url
SWAGGER_HOST=localhost:8000                         // Host Url for Swagger

```

## Running the server locally

 - Install  `node`, `npm`
 - Define env configuration
 - Run these commands

```sh
# Install deps
$ npm install

# Run the node server
$ gulp

```
The servers should be running at: <br/> [localhost:8000](https://localhost:8000)

## Running the server in Docker Container

Prerequisite For Docker Configuration : Docker and docker compose must be installed on the system.

Steps to run app in docker container :
  1. CD to project dir
  2. Create build using cmd: $ docker-compose build
  3. Start the server in daemon thread using cmd: $ docker-compose up -d  
  4. Stop the server using cmd : $ docker-compose down

## REST API Versioning
 Hapiness now supports versioning out of the box. For sample purposes, v1 and v2 folders with appropriate route handlers are shared with this boilerplate. The versioning is done at the router's level only. Services are still placed at a single place with no support for versioning.

## Testing
Hapiness now supports writting unit test cases using 'Mocha' and 'Supertest' node packages.
- To execute the test cases please run the following command -

```sh
# Test the server
$ npm test

```
## Hapiness Upgrade Guide.
We have upgraded from Hapi v16.x to LTS v17.2.3

The new Hapi.js version brought along a series of breaking changes from its predecessor. Summarising all of those is out of scope of this guide, however we have placed the link of the document we referred while doing this upgrade at the bootom of this readme. Following are the major changes we faced and thought are worth sharing with our followers -

#Creating plugins

To comply with the new structure, update your plugins to use a named export plugin that provides an object containing all the information. Please note that the register function now takes only the server and options object (got rid of next callback).

#hapi v16

```
exports.register = (server, options, next) => { … }

exports.register.attributes = {  
    pkg: require('../package.json')
};

```

#hapi v17

```
exports.plugin = {  
  register: (server, options) => {
    …
  },
  pkg: require('../package.json')
}
```

#No More 'reply()' callbacks

With hapi v17.x you can return values from route handlers directly, the reply interface isn’t available anymore.

#hapi v16

```
server.ext('onPreResponse', (request, reply) => { … })

const handler = (request, reply) => {  
  // return a string
  return reply('ok')

  // return an object and hapi creates JSON out of it
  return reply({ name: 'Future Studio', makeItRock: true })

  // redirect … to 404 … hehehehe :D
  return reply.redirect('/404')

  // return a view
  return reply.view('index', { name: 'Future Studio' })

  // use the "reply" to create a response with chained methods
  return reply(someHTML)
    .type('text/html')
    .header('X-Custom', 'my-value')
    .code(201)
}

```

#hapi v17
```
// the new structure applies to lifecycle points and request handlers
// here are some examples on how to use the new response toolkit

server.ext('onPreResponse', (request, h) => { … })

const handler = (request, h) => {  
  // return a string
  return 'ok'

  // return an object and hapi creates JSON out of it
  return { name: 'Future Studio', makeItRock: true }

  // redirect … to 404 
  return h.redirect('/404')

  // return a view
  return h.view('index', { name: 'Future Studio' })

  // use the "h" response toolkit to create a response
  return h
    .response(someHTML)
    .type('text/html')
    .header('X-Custom', 'my-value')
    .code(201)
}
```

For complete upgrade guide to upgrade from hapi 16.x to hapi 17.x please refer the link below:

https://futurestud.io/tutorials/hapi-v17-upgrade-guide-your-move-to-async-await

## Contributors
[Arpit Khandelwal](https://www.linkedin.com/in/arpitkhandelwal1984/)
[Vikas Patidar](https://www.linkedin.com/in/vikas-patidar-0106/)

