import * as dotenv from 'dotenv';
import * as mqtt from 'mqtt';
import * as format from './message_formatting.js';
import { EventEmitter } from 'events';

const succes_color = '\x1b[32m%s\x1b[0m';
const error_color = '\x1b[31m%s\x1b[0m';
const succes_send_color = '\x1b[35m%s\x1b[0m';
const didnt_send_color = '\x1b[36m%s\x1b[0m';

const messageEmitter = new EventEmitter();
let message_data = { "topic": "", "message": "" };

const sendMessageData = (data) => {
    messageEmitter.emit('messageUpdated', `${data}`);
}

let connection;

let connected_for_publishing = false;
// All topics for publishing
const publish_topic_bindings = {
    "movement2d": "zbos/motion/control/movement",
    "tts": "zbos/dialog/set",
    "sounds": "zbos/audio/player/start",
    "mapRequest": "zbos/slam/mapview/current/get"
};

// All topics for subscribing
// set key = "json" to log all data in json web component
const subscribe_topic_bindings = {
    "zbos/dialog/set": "json",
    "zbos/motion/control/movement": "json",
    "zbos/sensors/event": "json",
    "zbos/slam/mapview/current": "map",
    "zbos/slam/mapview/current/response/map": "mapResponse"
};

const mqttInit = () => {
    connection = mqtt.connect(process.env.MQTT_BROKER, { queueQoSZero: false });
    connection.on('connect', () => {
        console.log(succes_color, `Publisher connected to broker: ${process.env.MQTT_BROKER}`);
        subscribeToTopics(subscribe_topic_bindings);
        connected_for_publishing = true;
    })
    connection.on('reconnect', () => {
        console.log(error_color, `Connecting controller (reconnect) ...`);
        connected_for_publishing = false;
    })
    connection.on('error', (error) => {
        console.log(error_color, `Error connecting controller: ${error}`);
        connected_for_publishing = false;
    })

    connection.on('message', function (topic, message) {
        //TODO // const jsonData = format[subscribe_topic_bindings[topic]](message);   // format[source](data) calls a method with name of <source> inside message_formatting.js with argument <data>
        const stringData = message.toString();
        const jsonData = JSON.stringify({ "source": subscribe_topic_bindings[topic], "data": stringData });
        sendMessageData(jsonData);
    });
}

const subscribeToTopics = (bindings) => {
    for (const [key, value] of Object.entries(bindings)) {
        mqttSubscribe(key, value);
    }
}

const mqttSubscribe = (topic, source) => {
    connection.subscribe(topic, function (err) {
        if (!err) {
            console.log('\x1b[32m%s\x1b[0m', `${source} subscribed to ${topic}`);
        } else {
            console.log('\x1b[31m%s\x1b[0m', `${source}'s subscribtion to ${topic} failed!`);
        }
    });
}

const mqttSendJsonMessage = (source, data) => {
    const color = (connected_for_publishing ? succes_send_color : didnt_send_color);

    // if the message doesn't need to be transmissed over mqtt, "changedValue" is the key for the parameter value
    // this happens when the parameter value changes to be send with next messages
    const message = format[source](data);   // format[source](data) calls a method with name of <source> inside message_formatting.js with argument <data>
    if (message && ("changedValue" in message)) {
        console.log(color, `${source} -> parameter :: ${message.changedValue}`);
    }
    else if (message) {     // transmit formatted message
        console.log(color, `${source} -> ${publish_topic_bindings[source]} :: ${JSON.stringify(message)}`);
        if (connected_for_publishing) connection.publish(publish_topic_bindings[source], JSON.stringify(message));
    }
}

export { mqttInit, mqttSendJsonMessage, message_data, messageEmitter };