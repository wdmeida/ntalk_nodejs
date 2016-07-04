var express = require('express')
    , app = express()
    , load = require('express-load')
    , error = require('./middleware/error')
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , mongoose = require('mongoose');

/*
  Ao executar mongoose.connect cria-se uma conexão com o banco de dados MongoDB para
  Node.js. Como o MongoDB é schemaless, na primeira vez que a aplicação se conecta Como
  o banco através da url 'mongodb://localhost/ntalk' automaticamente em run-time é criada
  uma base de dados com o nome ntalk.
*/
global.db = mongoose.connect('mongodb://localhost/ntalk');

const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = express.cookieParser(SECRET)
  , store = new express.session.MemoryStore()
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

app.listen(3000, function(){
  console.log("Ntalk no ar...");
});
