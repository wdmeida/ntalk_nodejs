module.exports = function (app) {

    //Carrega o conteúdo de db_connect,js para poder abrir a conexão com o banco de dados.
    var db = require('../libs/db_connect')();
    var Schema = require('mongoose').Schema;

    var contato = Schema({
        nome: String
      , email: String
    });

    var usuario = Schema({
        nome: { type: String, required: true }
      , email: { type: String, required: true
               , index: {unique: true}}
      , contatos: [contato]
    });

    return db.model('usuarios',usuario);
};
