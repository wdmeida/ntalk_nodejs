module.exports = function (io) {

  var crypto = require('crypto')
    , redis_connect = require('../libs/redis_connect')
    , redis = redis_connect.getClient()
    , md5 = crypto.createHash('md5')
    , sockets = io.sockets;

  sockets.on('connection', function (client) {
    var session = client.handshake.session,
        usuario = session.usuario;

    client.set('email', usuario.email);

    var onlines = sockets.clients(); //retorna os ids dos clientes conectados.
    onlines.forEach(function(online) {
      var online = sockets.sockets[online.id]; //retorna um cliente pelo seu id.
      online.get('email', function(err, email){
        client.emit('notify-onlines', email);
        client.broadcast.emit('notify-onlines', email);
      });
    });

    client.on('join', function (sala) {
      if(sala) {
        sala = sala.replace('?','');
      } else {
        var timestamp = new Date().toString();
        var md5 = crypto.createHash('md5');
        sala = md5.update(timestamp).digest('hex');
      }
      client.set('sala', sala);
      client.join(sala);

      var msg = "<b>" + usuario.nome + ":</b> entrou.<br>";

      //redis.lpush(sala, msg) adiciona na lista de mensagem.
      redis.lpush(sala, msg, function(erro, res) {

        /*
          redis.lrange(sala, 0, -1) retorna um array contendo os elementos a partir de
           um range inicial e final da lista. O range utiliza dois índices, e neste Caso
           o índice inciial é 0 e o final é -1. Quando informamos o valor -1 no índice final
           indicamos que o range será total, retornando todos os elementos da lista.
        */
        redis.lrange(sala, 0, -1, function(erro, msgs) {
          msgs.forEach(function(msg) {
            sockets.in(sala).emit('send-client', msg);
          });
        });
      });
    });

    client.on('send-server', function (data) {
      var msg = "<b>" + usuario.nome + ":</b> " + msg + "<br>";
      client.get('sala', function(erro, sala) {
        redis.lpush(sala, msg);
        var data = {email: usuario.email, sala: sala};
        client.broadcast.emit('new-message', data);
        sockets.in(sala).emit('send-client', msg);
      });
    });

    client.on('disconnect', function () {
      client.get('sala', function(erro, sala) {
        var msg = "<b>" + usuario.nome + ":</b> saiu.<br>";
        redis.lpush(sala, msg);
        client.broadcast.emit('notify-offlines', usuario.email);
        sockets.in(sala).emit('send-client', msg);
        client.leave(sala);
      });
    });
  });
}
