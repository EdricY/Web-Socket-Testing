const WebSocket = require('ws');
const wss = new WebSocket.Server( { port : 3423 } );

var players = [];

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    if (data == "Connect") {
        console.log("Connection:  " + ws._socket.remoteAddress);
        ws.x = 100;
        ws.y = 100;
        ws.send(JSON.stringify({a:"hi from server"}));
        return;
    } else {
      data = JSON.parse(data);
      ws.x = data.x;
      ws.y = data.y;
    }

  });

  ws.on('close', function closing(data) {
        console.log('Disconnect');
  });
});




function tick() {
  wss.clients.forEach(function each(client) {

    if (client.readyState === WebSocket.OPEN) {
      let pList = [];
      for(let c of wss.clients){
        if (c.x != null && c !== client) {
          pList.push({x:c.x, y:c.y});
        }
      }
      client.send( JSON.stringify(pList) );
    }
  });
}

var serveInt = setInterval(tick, 10);
