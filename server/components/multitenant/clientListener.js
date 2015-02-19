var Clients = require('../../api/client/client.model');
var allowedSubs = {'admin':true, 'www':true };
function clientlistener() {
return function(req, res, next) {
     //console.log('look at my sub domain  ' + req.subdomains[0]);
    // console.log(req.session.Client);
    // console.log(typeof req.session.Client === 'undefined');

    if( req.subdomains[0] in allowedSubs ||  typeof req.subdomains[0] === 'undefined' || typeof req.session.Client !== 'undefined' && req.session.Client.name === req.subdomains[0] ){
        //console.dir('look at the sub domain  ' + req.subdomains[0]);
        //console.dir('testing Session ' + req.session.Client);
        console.log('did not search database for '+ req.subdomains[0]);
        //console.log(JSON.stringify(req.session.Client, null, 4));
        next();
    }
    else{
        Clients.findOne({'name': req.subdomains[0]}, function (err, client) {
            if(!err){
                if(!client){
                    //res.send(client);
                    //console.log('Sorry! you cant see that.');
                    res.send(403, 'Sorry! you cant see that.');
                }
                else{
                    //console.log('searched database for '+ req.subdomains[0]);
                    //console.log(JSON.stringify(client, null, 4));
                   // client.dbUrl = "mongodb://localhost/"+client.client;
                    //console.log(client);
                    //req.session.tester = "moyo cow";
                    req.session.Client = client;
                    return next();

                }
            }
            else{
                console.log("err >> " + err);
                return next(err)
            }

        });
    }

   }
 }

module.exports = clientlistener;