var config = require('../../config/environment');
function setCLientSocket(socketio) {
  return function(req, res, next) {
      if(typeof(req.session.Client) !== 'undefined' && global.App.clients[req.session.Client.name] !== req.subdomains[0]) {
	        if(req.session.Client && req.session.Client.name === req.subdomains[0] ) {
	        	if(typeof(global.App.clientSocket[req.session.Client.name]) === 'undefined') {
		                activeSocket = global.App.clientSocket[req.session.Client.name] = {'hostName':req.headers.host,'nameSpace':'/'+req.headers.host.split('.')[0]};
		            }
		            global.App.activeSocket = activeSocket;
		            require('../../config/socketio')(socketio);

	        	return next();
	        }
	    }
	    else {
	    	if(typeof(req.session.Client) === 'undefined') {
	           next();
	        }
	        else {
	        	global.App.activeSocket = global.App.clientSocket[req.session.Client.name];
	            return next();
	        }
	    }
    }
  }
module.exports = setCLientSocket;