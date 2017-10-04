const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1421 });

wss.on('connection', function connection(ws) {
  ws.name = "";
  ws.on('message', function incoming(data) {
    if (ws.name == "") {
      console.log('Connection: ' + ws._socket.remoteAddress + ' ' + data);
      ws.name = data;
      newcomer = ws.name;
      let members = "In room: ";
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('<i>' + newcomer + ' joined.' + '</i>');
          members += client.name + ', ';
        }
      });
      members = members.slice(0, -2);
      ws.send('<i>' + members + '</i>');
    } else {
      // Broadcast to everyone else.
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('<b>' + ws.name + '</b>: ' + data);
        }
      });
    }
  });
  ws.on('close', function closing() {
    console.log('Disconnect: ' + ws.name);
    wss.clients.forEach(function each(client) {
      client.send('<i>' + ws.name + ' left.</i>');
    });
  });
});