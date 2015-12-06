'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 8000});

var connection = require('./db').connect();
connection
  .then(function (database) {
    server.app.collections = database.collections;
  })
  .then(function () {
    // Provide access to collections
    server.bind({collections: server.app.collections});

    // Routes
    server.route(require('./routes'));

    // Decorators
    server.decorate('reply', 'notFound', function () {
      return this.response().code(404);
    });


    server.start(function (err) {
      if (err) {
        throw err;
      }

      console.log('Server running at: ', server.info.uri);
    });

  })
  .catch(function (err) {
    console.error(err);
  });