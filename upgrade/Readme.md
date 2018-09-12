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
