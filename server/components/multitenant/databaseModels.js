var Thing = require('../../api/thing/thing.model');
var User = require('../../api/user/user.model');

function databaseModels() {
  return function(req, res, next){
    /******************************************/
    // Create models using mongoose connection for use in controllers
    // require your models directory multi-tenant
      if(typeof req.db === 'undefined'){
        //console.log("compile models");
        req.db = {
          Thing: global.App.activdb.model('Thing', Thing, 'things'),
          User: global.App.activdb.model('User', User, 'users')
        };
    }
    return next();
  }
}
module.exports = databaseModels;