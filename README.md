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
│   │   ├── api            // Controllers are organized by module names for rest api 
│   │   └── web            // Controllers are organized by module names for web api.
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
├── config                 // Contains all app configurations
│   ├── assets.js          // Assets configuration file
│   ├── config.js          // Application configuration. 
│   ├── default.json       // Configuration file.
│   ├── manifest.js        // App manifest file listing all plugins and load order.
│   ├── meta.js            // App metadata file.
│   └── ssl                // Contains ssl certificates
├── lib                    // Core application lib/plugins
├── logs                   // Contains app log file 
└── tasks                  // Contains all gulp tasks
├── .gitignore             // standard git ignore file
├── .babelrc               // Babel config
├── .eslintrc              // Define eslint rules.
├── .eslintignore          // Ignores certain files for eslint rules
├── Dockerfile             // Standard doceker file
├── docker-compose.yml     // Standard docker compose file 
├── gulpfile.js            // Gulp entry file 
├── server.js              // Contains all app configurations
├── .env                   // dotenv configuration file for environment variable 
└── test
    ├── testcases          // Testcases organized by module names.
    └── test.js            // Test file.

```

## Code

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). All client-side js code is also in commonJS pattern packs using webpack. Check out `.eslintrc` for additional code conventions used.

## .env Configuration
To simulate environment variables in Dev environment, please create .env file at the root location and define the following properties -

```
DEBUGGER=false                                      // Enable/disable debug mode
NODE_ENV=production                                 // Node environment development/production
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
SWAGGER_HOST=localhost:8000                         // Host Url for Swagger
DATABASE_URL=mongodb://localhost:27017/hapiness     // Mongo database url
#DATABASE_URL=mongodb://mongodb:27017/hapiness      // Mongo database url while using docker

```
Please make sure you remove any _.env_ file present at the root of this project before you invoke docker-compose or else docker will pick up the environment variables from this file and may lead to inconsistent results.

## Running the server locally

 - Install  `node`, `npm`
 - Define env variables
 - Run the following commands

```sh
# Install deps
$ npm install

# Run the node server in dev mode
$ gulp dev

# Run the node server in production mode
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

In case you are willing to use this project as is (i.e. without external mongodb installation), the docker-compose provided with this project should suffice. It brings along a _mongodb_ service which stores the data in the _/db/data_ directory. But in case you wish to use your existing MongoDB installation then please remove the _mongodb_ service from the docker-compose.yml file and correct the database_url environment variable.

## REST API Versioning
Hapiness now supports versioning out of the box. For sample purposes, v1 and v2 folders with appropriate route handlers are shared with this boilerplate. The versioning is done at the router's level only. Services are still placed at a single place with no support for versioning.

## Testing
Hapiness now supports writing unit test cases using 'Mocha' and 'Supertest' node packages.
- To execute the test cases please run the following command -

```sh
# Test the server
$ npm test

```
## Upgrade to Hapi v17.x
The upgrade guide from earlier versions to v17.x can be found [here](https://github.com/sytango-technologies/Hapiness/blob/master/upgrade/Readme.md)

## Contributors
[Arpit Khandelwal](https://www.linkedin.com/in/arpitkhandelwal1984/)
[Vikas Patidar](https://www.linkedin.com/in/vikas-patidar-0106/)
