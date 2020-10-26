var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // console.log('an user connected');
  const nickname = 'user' + Math.ceil((Math.random() * 1000))
  socket.broadcast.emit('connection', nickname + ' connected')
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3030, function(){
  console.log('listening on *:3030');
});