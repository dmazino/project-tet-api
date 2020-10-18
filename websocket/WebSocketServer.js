var WebSocketServer = require('websocket').server;


const connections = new Set();

const states = { LIGHT_ON: 0b1, LIGHT_OFF: 0b0 };
const masks = { LIGHT: 0b1 }

const updateState = function (newState) {
    // sync all machines listening to this socket
    connections.forEach((conn) => {

        const buffer = Buffer.alloc(1, newState);
        conn.sendBytes(buffer);
    });
}

const init = function (server) {
    wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        // keep track of connections
        var connection = request.accept('echo-protocol', request.origin);
        connections.add(connection);
        console.log((new Date()) + ' Connection accepted.');

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);

                connections.forEach((conn) => {
                    conn.sendUTF(message.utf8Data);
                })
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes with value: ' + (message.binaryData[0] >>> 0).toString(2));

                // sync all machines listening to this socket
                connections.forEach((conn) => {
                    conn.sendBytes(message.binaryData);
                });
            }
        });
        connection.on('close', function (reasonCode, description) {
            connections.delete(connection)
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
}

module.exports = { init, states, masks, updateState };