var mongoose = require('mongoose');
var config = require('../../config/environment');
//var dynamicConnection = require('../models/dynamicMongoose');
function setclientdb() {
    return function(req, res, next){
        //check if client has an existing db connection  
    if(/*typeof global.App.clientdbconn === 'undefined' && */ typeof(req.session.Client) !== 'undefined' && global.App.clients[req.session.Client.name] !== req.subdomains[0])
    {
        //check if client session, matches current client if it matches, establish new connection for client
        if(req.session.Client && req.session.Client.name === req.subdomains[0] )
        {
            //console.log('setting db for client ' + req.subdomains[0]+ ' and '+ req.session.Client.dbUrl);//req.session.Client.dbUrl
            client = mongoose.createConnection(req.session.Client.dbUrl, config.mongo.options);

            client.on('connected', function () {
                //console.log('Mongoose default connection open to  ' + req.session.Client.name);
            });
            // When the connection is disconnected
            client.on('disconnected', function () {
                //console.log('Mongoose '+ req.session.Client.name +' connection disconnected');
            });

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', function() {
                client.close(function () {
                    //console.log(req.session.Client.name +' connection disconnected through app termination');
                    process.exit(0);
                });
            });

            //If pool has not been created, create it and Add new connection to the pool and set it as active connection

            if(typeof(global.App.clients) === 'undefined' || typeof(global.App.clients[req.session.Client.name]) === 'undefined' && typeof(global.App.clientdbconn[req.session.Client.name]) === 'undefined')
            {
                clientname = req.session.Client.name;
                global.App.clients[clientname] = req.session.Client.name;// Store name of client in the global clients array
                activedb = global.App.clientdbconn[clientname] = client; //Store connection in the global connection array
                //console.log('I am now in the list of active clients  ' + global.App.clients[clientname]);
                
                //global.App.clientSocket[clientname]
                //require('../../config/socketio')(socketio,clientname);
                
            }
            console.log("Create DB Conn");
            global.App.activdb = activedb;
            //console.log('client connection established, and saved ' + req.session.Client.name);
            next();
        }
        //if current client, does not match session client, then do not establish connection
        else
        {
            //console.log("delete req.session.Client");
            delete req.session.Client;
            client = false;
            next();
        }
    }
    else
    {
        if(typeof(req.session.Client) === 'undefined')
        {
        //console.log("req.session.Client is undefined");
           next();
        }
        //if client already has a connection make it active
        else{
            //console.log("setting activdb");
            global.App.activdb = global.App.clientdbconn[req.session.Client.name];
            //console.log('did not make new connection for ' + req.session.Client.name);
            return next();
        }

    }
    }
}

module.exports = setclientdb;