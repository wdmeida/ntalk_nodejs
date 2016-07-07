var cluster = require('cluster') //Módulo responsável por gerenciar processamento paralelo. Necessário pois node é single-thread.
  , cpus = require('os').cpus();

if (cluster.isMaster) {
  cpus.forEach(function(cpu) {
    cluster.fork();
  });

  cluster.on('listening', function(worker) {
    console.log('Cluster %d está conectado.', worker.process.pid);
  });

  cluster.on('disconnect', function(worker) {
    console.log('Cluster %d está desconectado.', worker.process.id);
  });

  cluster.on('exit', function(worker) {
    console.log('Cluster %d caiu fora.', worker.process.pid);
  });

} else {
  require('./app');
}
