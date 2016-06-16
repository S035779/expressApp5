var express = require('express');
var session = require('express-session');

//sessionを元にRedis Storeを取得
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

var app = express();

//セッション設定(Redis Store使用)
var redisClient = redis.createClient(6379,"127.0.0.1",{ auth_pass: "mamo-pass" });
redisClient.select(0);
app.use(session({
  store: new RedisStore( { client: redisClient }),
  secret : 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));
redisClient.keys("sess:*", function(error, keys){
  console.log("Number of active sessions: ", keys.length);
});
     
//ルーティング設定
app.get('/redis-store-counter', function(req, res) {
  var session = req.session;
  if (session && session.count) {
    session.count++;
  } else {
    session.count = 1;
  }
  res.send('count is ' + session.count)
});
                 
app.listen(3000);
console.log('Server running at http://localhost:3000/');
