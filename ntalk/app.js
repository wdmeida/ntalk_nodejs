var express = require('express')
    , app = express()
    , load = require('express-load')
    , error = require('./middleware/error');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
/*
  express.methodOverride() permite utilizar um mesmo path entre os
  métodos do HTTp, fazendo uma sobrestrita de métodos.
*/
app.use(express.methodOverride());
/*
  Gerencia as rotas da aplicação, permitindo a implementação de rotas
  para páginas de erros e rotas para arquivos estáticos, sem conflitar
  com as rotas da aplicação.
*/
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);
//app.get('/', routes.index);
//app.get('/usuarios', routes.user.index);

load('models').then('controllers').then('routes').into(app);

app.listen(3000, function(){
  console.log("Ntalk no ar...");
});
