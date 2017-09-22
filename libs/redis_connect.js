var redis = require('redis')
  , express = require('express')
  , redisStore = require('connect-redis')
  , socketio = require('socket.io');

exports.getClient = function() {
  return redis.createClient();
}

exports.getExpressStore = function() {
  return redisStore(express);
}

exports.getSocketStore = function() {
  return socketio.RedisStore;
}
