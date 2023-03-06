// -----Functions for formatting outgoing mqtt messages-----
// Function name has to be the component's id

let degrees_;
let radians_;
let force_ = 100; // how fast the robot drives
let speed_ = 100; // speed of the voice

const movement2d = (data) => {
    let x = data.x;
    let y = data.y;

    // No need to calculate an angle and send it if x and y equals 0
    if (x === 0 && y === 0) {
        return null;
    } else {
        radians_ = Math.atan2(y, x);
        degrees_ = radToDegrees(radians_);
        let message = { "angle": { "degree": degrees_ }, "force": force_ };
        return message;
    }
}

// {"message":"hallo","language":"de-DE","pitch":52,"speed":100}
const tts = (data) => {
    const message = { "message": data.message, "language": "nl-NL", "pitch": 52, "speed": speed_ };
    return message;
}

const force = (data) => {
    force_ = data.value;
    const message = { "changedValue": force_ };
    return message;
}

const speed = (data) => {
    speed_ = data.value;
    const message = { "changedValue": speed_ };
    return message;
}

// {
//     "requestId": "44",
//     "url": "https://www.myinstants.com/media/sounds/movie_1_C2K5NH0.mp3",
//     "loop": true
//   }
const sounds = (data) => {
    const message = { "url": data.link };
    return message;
}

const radToDegrees = (rads) => {
    return rads * 180 / Math.PI;
}

const mapRequest = (data) => {
    return data;
}

const enableScanning = (data) => {
    return data;
}

// --------------------------------------------------

// -----Functions for formatting incoming mqtt messages-----
// returns JSON string

const json = (message) => {
    const stringData = message.toString();
    const jsonData = JSON.stringify({ "destination": "json", "data": stringData });
    return jsonData;
}

const map = (message) => {
    const stringData = message.toString();
    const jsonData = JSON.stringify({ "destination": "map", "data": stringData });
    return jsonData;
}

const mapResponse = (message) => {
    const stringData = message.toString();
    const mapStringData = JSON.parse(stringData).data.toString();
    const jsonData = JSON.stringify({ "destination": "map", "data": mapStringData });
    return jsonData;
}

// --------------------------------------------------

export { 
        movement2d, force, tts, speed, sounds, mapRequest, enableScanning,
        json, map, mapResponse
        };