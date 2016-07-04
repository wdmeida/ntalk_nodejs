module.exports = function(app) {
  var Usuario = app.models.usuario;

  var HomeController = {
    //Renderiza a index da aplicação.
    index: function(req, res) {
      res.render('home/index');
    },

    login: function(req, res) {
      var query = {email: req.body.usuario.email};

      //Pesquisa o email do usuário informado e verifica se o mesmo existe.
      Usuario.findOne(query)
              .select('nome email')
              .exec(function(erro, usuario) {

        //Caso exista, salva as informações para sessão do usuário e redireciona para contatos.
        if (usuario) {
          req.session.usuario = usuario;
          res.redirect('/contatos');
        } else {
          //Caso não existe, cria um novo usuário com as informações e redireciona o fluxo para contatos.
          Usuario.create(req.body.usuario, function (erro, usuario) {
              if(erro) {
                console.log(erro);
                res.redirect('/');
              } else {
                req.session.usuario = usuario;
                res.redirect('/contatos');
              }
            });
          }
        });
      },
      logout: function(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
  };
  return HomeController;
};
