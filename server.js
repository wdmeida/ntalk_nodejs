var forever = require('forever-monitor')
  , Monitor = forever.Monitor;

var child = new Monitor('cluster.js', {
  max: 10, //Total de vezes que o servidor poderá ser reiniciado quando ele cair.
  silent: true, //Oculta ou não e exibição de logs no terminal.
  killTree: true, //Todos os processos filhos serão finalizados a cada restart do servidor.
  logFile: 'forever.log',
  outFile: 'app.log',
  errFile: 'error.log'
});

child.on('exit', function() {
  console.log('O servidor foi finalizado.');
});

child.start();
