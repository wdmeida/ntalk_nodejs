var express = require('express')
    , app = express()
    , load = require('express-load')
    , server = require('http').createServer(app)
    , error = require('./middleware/error')
    , io = require('socket.io').listen(server)
    , mongoose = require('mongoose')
    , redis = require('./libs/redis_connect')
    , ExpressStore = redis.getExpressStore()
    , SocketStore = redis.getSocketStore();

const KEY = 'ntalk.sid', SECRET = 'Ntalk';
var cookie = express.cookieParser(SECRET)
  , storeOpts = {client: redis.getClient(), prefix: KEY}
  , store = new ExpressStore(storeOpts)
  , sessOpts = {secret: SECRET, key: KEY, store: store}
  , session = express.session(sessOpts);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);
//app.get('/', routes.index);
//app.get('/usuarios', routes.user.index);

io.set('store', new SocketStore);

io.set('authorization', function(data, accept) {
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[KEY];
    store.get(sessionID, function(err, session) {
      if (err || !session) {
        accept(null, false);
      } else {
        data.session = session;
        accept(null, true);
      }
    });
  });
});

load('models').then('controllers').then('routes').into(app);
load('sockets').into(io);

server.listen(3000, function(){
  console.log("Ntalk no ar...");
});

//Exporta a variável que contém as funções do servidor da aplicação.
module.exports = app;
