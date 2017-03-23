![Hapiness](https://github.com/sytango-technologies/Hapiness/blob/master/assets/images/logo2.png)

## Hapiness
Production ready Hapi boilerplate application with dual servers inbuilt.

## Credits
Thanks to [ravisuhag/jolly](https://github.com/ravisuhag/jolly) for his wonderful boilerplate app which became the base of Hapiness.

## Description
'Hapiness' boilerplate application serves as a great starting point for all the Hapi.js developers who were looking for a platform for their production servers. This app instantiates two servers on startup:

1) localhost:8000 - Server for web application <br />
2) localhost:8001 - Server for mobile/Rest APIs

Both the servers have their independent authentication mechanisms, the web application server uses the cookie based authentication and the api server uses the JWT authentication for the rest api access. The deployment and application management is done via 'Gulp' and there are different configurations/tasks for starting the app in the development vs the production environment. This application assumes the availability of 'MongoDB' installation on the localhost where the server will run.

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

## TO-DO
One of the items we have identified for future is containerizing the app using 'Docker'.

## Technology

- **Hapi** - Server side framework
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


## Application Structure

```
|
| -- app
|   |-- controllers        // Controllers are organised by module names
|   |   |-- <module_name>  // Each controller defines config and handler for that route.
|   |
|   |-- helpers            // Helper functions used across application
|   |-- models             // All mongoose models are defined here
|   |-- routes             // All app routes are defined here
|   |   |-- <route_plugin> // Route module is a hapi plugin and can be toggled from config/manifest.js
|   |
|   `-- templates          // All server-rendered handlebar templates, partials and helpers
|       |-- <module_name>  // Templates are organised by module names.
|   
|-- assets                 // Contains all static resources 
|   |-- fonts              // Fonts used in application
|   |-- images             // Images used in application
|   |-- misc               // Misc resources used in application
|   |-- scripts            // Client javscripts files which are then packed by webpack
|   |-- styles             // All SASS stylesheets
|   |   |-- <module_name>  // Styles are organised by module names. 
|   
|-- config                 // Contains all app configurations
|   |-- ssl                // Contains ssl certificates
|   |-- assets.js          // Assets configuration file
|   |-- config.js          // Application configuration file which stores all passwords etc. (gitignore).
|   |-- manifest.js        // App manifest file listing all plugins and load order. 
|   |-- meta.js            // App metadata file. 
|   
|-- lib                    // Core application lib/plugins 
|-- tasks                  // Contains all gulp tasks 
|
|-- gulpfile.js            // Gulp entry file 
|-- index.js               // Application starting point
|-- package.js             // Package configuration file
|-- server.js              // Main server file
|-- .env              	   // dotenv configuration file for environment variable management
|-- .gitignore             // standard git ignore file
|-- .babelrc               // Babel config
|-- .eslintrc              // WebPack config
|-- .eslintignore          // Ignores certain files for eslint rules
```

## Code

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). All client-side js code is also in commonJS pattern packs using webpack. Check out `.eslintrc` for additional code conventions used.

## Running the server locally

 - Install  `node`, `npm`
 - Run these commands

```sh
# Install deps
$ npm install

# Run the node server
$ gulp

```
The servers should be running at: <br/> 1) [localhost:8000](https://localhost:8000) and <br/> 2) [localhost:8001](https://localhost:8001)

## Contributors

[Systango-Technologies](https://github.com/sytango-technologies)