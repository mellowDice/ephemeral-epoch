var io = require('socket.io')(process.env.PORT || 3030);
var fs = require('fs');

console.log('Server started');

var players = [];
var playerID = 0;

var terraindata;
fs.readFile('./sample_landscape_data', 'utf8', (err, data) => {
  if(err) {
    console.log(err);
  }
  terraindata = JSON.parse(data);
  console.log(terraindata)
  console.log("Done building map...");
})

io.on('connection', function(socket) {
  // console.log(terraindata);
  var currID = playerID++;
  players.push(currID);

  console.log('>>>New User<<< with ID:', currID);

  socket.broadcast.emit('spawn', {id: currID});
  socket.broadcast.emit('requestPosition');
  // socket.emit('spawn');
  players.forEach(function(playerID) {
    if (currID === playerID) {
      return;
    }
    socket.emit('spawn', {id: playerID});
    console.log('Sending spawn to player...', playerID);
  })

  socket.emit('logged', {'data': terraindata});

  // socket.on('loggedIn', function(data) {
  //   console.log('Client has connected');
  // })

  socket.on('move', function(data) {
    data.id = currID;
    console.log('Client moved', JSON.stringify(data));
    socket.broadcast.emit('move', data);
  })

  socket.on('updatePosition', function(data) {
    console.log("updatePosition:", data);
    data.id = currID;
    socket.broadcast.emit('updatePosition', data);
  })
  socket.on('disconnect', function(data) {
    console.log('Client Disconnected');
    socket.broadcast.emit('clientDisconnect', {id: currID});
    players.splice(players.indexOf(currID), 1);
  })
})