var express = require('express')
    , app = express()
    , load = require('express-load')
    , server = require('http').createServer(app)
    , error = require('./middleware/error')
    , cfg = require('./config.json')
    , io = require('socket.io').listen(server)
    , mongoose = require('mongoose')
    , redis = require('./libs/redis_connect')
    , ExpressStore = redis.getExpressStore()
    , SocketStore = redis.getSocketStore();

//Configurações de session e cookies
var cookie = express.cookieParser(cfg.SECRET)
  , storeOpts = {client: redis.getClient(),
                 prefix: cfg.KEY}
  , store = new ExpressStore(storeOpts)
  , sessOpts = {secret: cfg.SECRET,
                key: cfg.KEY,
                store: store}
  , session = express.session(sessOpts);

//Stack de configurações do Express.
app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.compress(cfg.GZIP_LVL))
app.use(app.router);
app.use(express.static(__dirname + '/public', cfg.MAX_AGE));
app.use(error.notFound);
app.use(error.serverError);

//Stack de configurações do Socket.IO
io.enable('browser client cache');
io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);
io.set('store', new SocketStore);
io.set('authorization', function(data, accept) {
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[cfg.KEY];
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
