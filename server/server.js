import * as dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import APP from './app.js';
import * as mqqtUtil from './mqttUtil/mqtt.js';


dotenv.config();

const HTTP = http.createServer();
const wss = new WebSocketServer({ server: HTTP });

HTTP.on('request', APP);

mqqtUtil.mqttInit();

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        let incoming;
        try {
            incoming = JSON.parse(message);
        } catch (error) {
            console.warn("PAYLOAD ERROR");
            console.dir(error);
            incoming = { "payload": "illegal payload" };
        }

        switch (incoming.payload) {
            case "controller-connected":
                const remote = ws._socket.remoteAddress.toString();
                console.log(`Incoming controller connection from ${remote.slice(7)}\n`);
                break;
            case "mqtt":
                mqqtUtil.mqttSendJsonMessage(incoming.source, incoming.data);
                break;
            default:
                console.log(`log: ${incoming.payload}`);
        }
    });

    mqqtUtil.messageEmitter.on('messageUpdated', (data) => {
        // Sends a JSON string
        ws.send(data);
    });
});

HTTP.listen(process.env.PORT, () => {
    console.log(`Node HTTP and WS server on ${process.env.HOST}, port ${process.env.PORT} ...\n\n`);
});