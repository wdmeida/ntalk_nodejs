var cluster = require('cluster') //Módulo responsável por gerenciar processamento paralelo. Necessário pois node é single-thread.
  , cpus = require('os').cpus();

//Verifica se é o cluster master.
if (cluster.isMaster) {
  //Caso seja, realiza um loop cuja as iterações são baseadas no total de cpus.
  cpus.forEach(function(cpu) {
    //A cada iteração, o cluster.fork() intancia um processo filho para cada cpu.
    cluster.fork();
  });

  //O evento listening acontece quando um cluster está escutando uma porta do servidor.
  cluster.on('listening', function(worker) {
    console.log('Cluster %d está conectado.', worker.process.pid);
  });

  //O evento disconnect executa seu calback quando um cluster se desconecta da rede.
  cluster.on('disconnect', function(worker) {
    console.log('Cluster %d está desconectado.', worker.process.id);
  });

  //O evento exite ocorre quando um processo-filho é fechado no sistema operacional.
  cluster.on('exit', function(worker) {
    console.log('Cluster %d caiu fora.', worker.process.pid);
  });

} else {
  //Caso não seja o cluster master é iniciado o servidor da aplicação.;
  require('./app');
}
