var app = require('../app')
  //, should = require('should')
    /*
      Injeta a variável app que contém as funções do servidor da aplicação, que foi exportada
      do arquivo app.js. Ao ser injetado, ela se encarrega de iniciar o servidor para que o
      supertest tenha as informações necessárias para emular requisições e assim permitir que
      façamos os testes funcionais das rotas.
    */
  , request = require('supertest')(app);

describe('No controller home', function() {
  it('deve retornar status 200 ao fazer GET /', function(done) {
    request.get('/').end(function(err, res) {
      res.status.should.eql(200);
      done();
    });
  });

  it('deve ir para rota / ao fazer GET /sair', function(done) {
    request.get('/sair').end(function(err, res) {
      res.headers.location.should.eql('/');
      done();
    });
  });

  it('deve ir para rota /contatos ao fazer POST /entrar', function(done) {
    var login = {usuario: {nome: 'Teste', email: 'teste@teste'}};
    request.post('/entrar').send(login).end(function(err, res) {
      res.headers.location.should.eql('/contatos');
      done();
    });
  });

  it('deve ir para rota / ao fazer POST /entrar', function(done) {
    var login = {usuario: {nome: '', email: ''}};
    request.post('/entrar').send(login).end(function(err, res) {
      res.header.location.should.eql('/');
      done();
    });
  });

}); //fim da função describe
