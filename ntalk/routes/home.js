//Define as rotas que serão utilizadas pela aplicação.
module.exports = function(app) {
  var home = app.controllers.home;
  app.get('/', home.index);
  app.post('/entrar', home.login);
  app.get('/sair', home.logout);
};
