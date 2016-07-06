var app = require('../app')
  , should = require('should')
  , request = require('supertest')(app);

/* Como serão dois casos de testes a serem testados no controller contatos,
   eles serão particionados em dois casos específicos dentro do controller.
*/
describe('No controller contatos', function() {

  //Testes para usuário não logado.
  describe('o usuario nao logado', function() {

    it('deve ir para / ao fazer GET /contatos', function(done) {
      request.get('/contatos').end(function (err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para / ao fazer GET /contato/1', function(done) {
      request.get('/contato/1').end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para / ao fazer GET /contato/1/editar', function(done) {
      request.get('/contato/1/editar').end(function (err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir pra / ao fazer POST /contato', function(done) {
      request.post('/contato').end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir pra / ao fazer DELETE /contato/1', function(done) {
      request.del('/contato/1').end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('deve ir para / ao fazer PUT /contato/1', function(done) {
      request.put('/contato/1').end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

  }); //Fim testes usuário não logado.

  //Testes para usuário logado.
  describe('o usuario logado', function() {
      //Define as variáveis que guardaram as informaçõe utilizadas em todos os testes.
      var login = {usuario: {nome: 'Teste', email: 'teste@teste'}}
        , contato = {contato: {nome: 'Teste', email: 'teste@teste'}}
        , cookie = {};

      /*
        A função beforeEach() é executada antes de cada teste. Dentro dessa função,
        será feito um login no sistema para capturar o seu cookie, que é encontrado
        dentro de res.headers['set-cookie'], armazená-lo em uma variável que será usada
        no mesmo escopo da função describe('o usuario logado') para que seja utilizado para
        cada um dos testes.
      */
      beforeEach(function(done) {
        request.post('/entrar')
               .send(login)
               .end(function(err, res) {
           cookie = res.headers['set-cookie']; //Obtém os dados armazenados em cookie após o login.
           done();
         });
      });

      it('deve retornar status 200 em GET /contatos', function(done) {
        var req = request.get('/contatos');
        req.cookies = cookie; //Injeta os dados obtidos no cookie para realizar a requisição.
        req.end(function(err, res) {
          res.status.should.eql(200);
          done();
        });
      });

      it('deve ir para rota /contatos em POST /contato', function(done) {
        var req = request.post('/contato');
        req.cookies = cookie;
        req.send(contato).end(function(err, res) {
          res.headers.location.should.eql('/contatos');
          done();
        });
      });
  }); //Fim testes usuário logado.

});
