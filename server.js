require('dotenv').config();
const WSS = require('ws').Server;
const HTTP = require('http').createServer();
const APP = require('./app');
const { mqttInit, mqttSendJsonMessage } = require('./communication/mqtt.js');

let wss = new WSS({
    server: HTTP
});

HTTP.on('request', APP);

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // console.log(`received: ${message}`);
        let incoming;
        try {
            incoming = JSON.parse(message);
        } catch (error) {
            console.warn("PAYLOAD ERROR");
            console.dir(error);
            incoming = { "payload": "illegal payload" };
        }

        switch (incoming.payload) {
            case "input-connected":
                mqttInit(incoming.id);
                break;
            case "mqtt":
                mqttSendJsonMessage(incoming.source, incoming.data);
                break;
            default:
                console.log(`log: ${incoming.payload}`);
        }
    });
});

HTTP.listen(process.env.PORT, () => {
    console.log(`Node HTTP and WS server on ${process.env.HOST}, port ${process.env.PORT} ...\n\n`);
});