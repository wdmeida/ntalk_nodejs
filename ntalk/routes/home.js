var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Define as rotas que serão utilizadas pela aplicação.
module.exports = function(app) {
  var home = app.controllers.home;
  app.get('/', home.index);
  app.post('/entrar', home.login);
  app.get('/sair', home.logout);
};
