module.exports = function(app) {

  var Usuario = app.models.usuario;

  //Define as ações das actions que serão executadas pelo controller Contatos
  var ContatosController = {

    //Action index.
    index: function(req, res) {
      var _id = req.session.usuario.id;

      //Retorna os dados do usuário baseado no seu _id.
      Usuario.findById(_id, function(erro, usuario) {
        var contatos = usuario.contatos;
        var resultado = {contatos: contatos};
        res.render('contatos/index', resultado);
      });
    },

    //Action create.
    create: function(req, res) {
      var _id = req.session.usuario._id;

      Usuario.findById(_id, function(erro, usuario) {
        var contato = req.body.contato;
        var contatos = usuario.contatos;
        contatos.push(contato);

        usuario.save(function() {
          res.redirect('/contatos');
        });
      });

      usuario.contatos.push(contato);
      res.redirect('/contatos');
    },

    //Action show.
    show: function(req, res) {
      var _id = req.session.usuario._id;

      Usuario.findById(_id, function(erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/show', resultado);
      });
    },

    //Action edit.
    edit: function(req, res) {
      var _id = req.session.usuario._id;

      Usuario.findById(_id, function(erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/edit', resultado);
      });
    },

    //Action update.
    update: function(req, res) {
      var _id = req.session.usuario._id;

      Usuario.findById(_id, function(erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        contato.nome = req.body.contato.nome;
        contato.email = req.body.contato.email;
        usuario.save(function() {
          res.redirect('/contatos');
        });
      });
    },

    //Action destroy.
    destroy: function(req, res) {
      var _id = req.session.usuario._id;

      Usuario.findById(_id, function(erro, usuario) {
        var contatoID = req.params.id;
        usuario.contatos.id(contatoID).remove();
        usuario.save(function() {
          res.redirect('/contatos');
        });
      });
    }

  }
  return ContatosController;
};
