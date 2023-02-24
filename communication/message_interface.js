// Function name has to be the component's id

let degrees_;
let radians_;
let force_ = 100; // how fast the robot drives
let speed_ = 100; // pitch and speed of the voice

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

const radToDegrees = (rads) => {
    return rads * 180 / Math.PI;
}

module.exports = {
    movement2d,
    force,
    tts,
    speed
};