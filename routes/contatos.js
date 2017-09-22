//Define as rotas que serão utilizadas para seguindo a arquitetura REST..
module.exports = function(app) {
  var autenticar = require('./../middleware/autenticador'),
      contatos = app.controllers.contatos;
  app.get('/contatos', autenticar, contatos.index);
  app.get('/contato/:id', autenticar, contatos.show);
  app.post('/contato', autenticar, contatos.create);
  app.get('/contato/:id/editar', autenticar, contatos.edit);
  app.put('/contato/:id', autenticar, contatos.update);
  app.delete('/contato/:id', autenticar, contatos.destroy);
};
