/* global io */
'use strict';

angular.module('nodeApp')
  .factory('socket', function(socketFactory,$location,Auth) {
    var namespace = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/' + $location.host().split(".")[0];
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io(namespace, {
      // Send auth token on connection, you will need to DI the Auth service above
      //'query': 'token=' + Auth.getToken(),
      'path': '/socket.io-client',
      'force new connection': true
    });
console.log(ioSocket);
    var socket = socketFactory({
      ioSocket: ioSocket
    });
    var url = $location.host() + ':' + $location.port();
    return {
      socket: socket,
      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;
        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(url + ':' + modelName + ':save', function (item) {
          console.log(url + ':' + modelName + ':save');
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(url + ':' + modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(url + ':' + modelName + ':save');
        socket.removeAllListeners(url + ':' + modelName + ':remove');
      }
    };
  });
