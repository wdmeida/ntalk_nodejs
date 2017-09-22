/*
    Esse filtro verifica se existe um usuário dentro da sessão. Se
    o usuário estiver autenticado, será executado o callback return next()
    responsável por pular este filtro e indo para função ao lado. Caso a
    autenticação não aconteça, executa um simplex return res.redirect('/'),
    que faz o usuário voltar para a home.
*/
module.exports = function(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/');
  }
  return next();
};
