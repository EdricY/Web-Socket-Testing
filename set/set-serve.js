const WebSocket = require('ws');
const wss = new WebSocket.Server( { port : 2422 } );

var board = [];
for (i in [0, 1, 2, 3]) {
    let row = [];
    for (j in [0, 1, 2]) {
        row.push(randomCard(i, j));
    }
    board.push(row);
}

var timer = 60;
var countdownInterval = setInterval(countdown, 1000);

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        if (data == "Connect") {
            console.log("Connection:  " + ws._socket.remoteAddress);
            ws.score = 0;
            ws.send( JSON.stringify({ board: board, score: ws.score, connect: true, timer: timer}) );
            return;
        }
        data = JSON.parse(data);
        if (verifySet(data)) {
            for (card of data) {
                board[card.i][card.j] = randomCard(card.i, card.j);
            }
            ws.score++;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send( JSON.stringify({ board: board, score: client.score }) );
                }
            });
            timer = 60;
        } else {
            ws.send( JSON.stringify({ board: board }));
        }
    });
    ws.on('close', function closing(data) {
        console.log('Disconnect ' + data + ' score: ' + ws.score);
    });
});

function verifySet(set) {
    try {
        if (set.length != 3) return false;
        let cScore = 0;
        let sScore = 0;
        let iScore = 0;
        for (card of set) {
            let boardCard = board[card.i][card.j];
            cScore += boardCard.color;
            sScore += boardCard.shape;
            iScore += boardCard.shapeColor;
        }
        return cScore % 3 + sScore % 3 + iScore % 3 == 0
    } catch(ex) {
        return false;
    }
}

function randomCard(i, j) {
    return {
        color : Math.floor((Math.random() * 3)),
        shape:  Math.floor((Math.random() * 3)),
        shapeColor : Math.floor((Math.random() * 3)),
        i : i,
        j : j
    }
}
function resetBoard() {
    board = [];
    for (i in [0, 1, 2, 3]) {
        let row = [];
        for (j in [0, 1, 2]) {
            row.push(randomCard(i, j));
        }
        board.push(row);
    }
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send( JSON.stringify({ board: board, reset: true }) );
        }
    });
}
function countdown() {
    timer--;
    if (timer <= 0) {
        resetBoard();
        timer = 60;
    }
}
