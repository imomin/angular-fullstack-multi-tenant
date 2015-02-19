/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./thing.model');

exports.register = function(socketio) {
  thing.schema.post('save', function (doc) {
    onSave(socketio, doc);
  });
  thing.schema.post('remove', function (doc) {
    onRemove(socketio, doc);
  });
}

function onSave(socketio, doc, cb) {
	//console.log(socketio);
	//console.log('***************************************************');
	//console.log(socket.sockets.server.nsps['/test2']);
	//var hostName = global.App.activSocket.hostName;
	
	// console.log(socket.request.headers.cookie);
	// console.log(hostName +' <|> '+ doc);
	// console.log(global.App.activeSocket.hostName +':thing:save');
	// console.log('namespace >> ' + global.App.activeSocket.nameSpace);
	// console.log('hostName >> ' + global.App.activeSocket.hostName);

	socketio.of(global.App.activeSocket.nameSpace).emit(global.App.activeSocket.hostName +':thing:save', doc);
}

function onRemove(socketio, doc, cb) {
	//console.log(socket);
	// console.log('***************************************************');
	//console.log(socket.request);
	// var hostName = global.App.activSocket.hostName;
	// var namespace = hostName.split('.')[0];
	//console.log(socket.request.headers.cookie);
	// console.log(hostName +' <|> '+ doc);
	// console.log(global.App.activeSocket.hostName +':thing:remove');
	// console.log('namespace >> ' + global.App.activeSocket.nameSpace);
	// console.log('hostName >> ' + global.App.activeSocket.hostName);

  	socketio.of(global.App.activeSocket.nameSpace).emit(global.App.activeSocket.hostName +':thing:remove', doc);
}