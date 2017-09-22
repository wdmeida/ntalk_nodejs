var mongoose = require('mongoose')
  , single_connection
  , env_url = {
    "test": "mongodb://127.0.0.1:27017/ntalk_test",
    "development": "mongodb://127.0.0.1:27017/ntalk"
  }
;

mongoose.Promise = global.Promise;

module.exports = function() {
  var env = process.env.NODE_ENV || "development"
    , url = env_url[env];
  if(!single_connection) {
    single_connection = mongoose.createConnection(url);
  }

  return single_connection;
};
