import { HOST, PORT } from "../env.js"
import "./joystick.js";
import "./tts.js";
import "./slider.js";
import "./soundboard.js"
import "./JSONviewer.js"

const height = 75;
const width = 75;

// Add components here (id is important for communication)
// const html = `
//     <joystick-Ƅ id="movement2d"></joystick-Ƅ>
//     <tts-Ƅ id="tts"></tts-Ƅ>
//     <slider-Ƅ id="force" min="0" max="200" start="100"></slider-Ƅ>
//     <slider-Ƅ id="speed" min="0" max="500" start="100"></slider-Ƅ>
// `;

// Available components:
// <joystick-Ƅ id="movement2d"></joystick-Ƅ>
// <tts-Ƅ id="tts"></tts-Ƅ>
// <slider-Ƅ id="force" min="0" max="200" start="100"></slider-Ƅ>
// <slider-Ƅ id="speed" min="0" max="500" start="100"></slider-Ƅ>
// <soundboard-Ƅ id="sounds"></soundboard-Ƅ>

const html = `
        <div class="one">
            <joystick-Ƅ id="movement2d"></joystick-Ƅ>
        </div>
        <div class="two">
            <soundboard-Ƅ id="sounds"></soundboard-Ƅ>
        </div>
        <div class="three">
            <tts-Ƅ id="tts"></tts-Ƅ>
        </div>
`

const style = document.createElement('style');
style.textContent = `
    :host {
        background-color: #ecf0f3;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: minmax(100px, auto);
        height: ${height}%;
        width: ${width}%;
        border: 5px solid #000;
        border-radius: 1rem;
        position: fixed;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .one {
        position: relative;
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        height: 100%;
    }
    .two {
        position: relative;
        grid-column: 2;
        grid-row: 1;
        width: 100%;
        height: 100%;
    }
    .three {
        position: relative;
        grid-column: 1;
        grid-row: 2;
        width: 100%;
        height: 100%;
    }
    .four {
        position: relative;
        grid-column: 2;
        grid-row: 2;
        width: 100%;
        height: 100%;
    }

`;

// Make a variable to hold data for every inputsensor
let movement2d = { "x": 0, "y": 0 };
let tts = { "message": "" };
let force = { "value": 0 };
let speed = { "value": 0 };
let sounds = { "link": "" };
// ----------------------------------------------

window.customElements.define('controller-Ƅ', class extends HTMLElement {
    constructor() {
        super();
        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.innerHTML = html;
        this._shadowroot.appendChild(style);

        this.socket = new WebSocket(`ws://${HOST}:${PORT}`);
    }

    connectedCallback() {
        this.socket.addEventListener('message', event => {
            let incoming;
            try {
                incoming = JSON.parse(event.data);
            } catch (error) {
                console.warn("PAYLOAD ERROR");
                console.dir(error);
                incoming = { "payload": "illegal payload" };
            }
            switch (incoming) {
                default:
                    this.sendJsonData(incoming);
            }
        });

        this.socket.addEventListener('open', event => {
            console.log("opening socket for controller ...")
            this.socket.send(JSON.stringify({ "payload": `controller-connected` }));

            // Add event listeners for every continuous inputsensor
            this.addEventListener("movement2d", (e) => {
                movement2d.x = e.detail.x;
                movement2d.y = e.detail.y;
            });
            // ---------------------------------------------

            // logPeriodicalInput is used to periodically send the global variable ( logInput(this.socket, <source(id of component)>, <data>, <period(ms)>); )
            // Do this for the continuous inputsensors
            logPeriodicalInput(this.socket, "movement2d", movement2d, 300);
            // --------------------------------------------

            // Add event listeners for every single fire inputsensor
            this.addEventListener("tts", (e) => {
                tts.message = e.detail.message;
                let message = { "payload": "mqtt", "source": "tts", "data": tts };
                this.socket.send(JSON.stringify(message));
            });
            this.addEventListener("force", (e) => {
                force.value = e.detail.value;
                let message = { "payload": "mqtt", "source": "force", "data": force };
                this.socket.send(JSON.stringify(message));
            });
            this.addEventListener("speed", (e) => {
                speed.value = e.detail.value;
                let message = { "payload": "mqtt", "source": "speed", "data": speed };
                this.socket.send(JSON.stringify(message));
            });
            this.addEventListener("sounds", (e) => {
                sounds.link = e.detail.link;
                let message = { "payload": "mqtt", "source": "sounds", "data": sounds };
                this.socket.send(JSON.stringify(message));
            });
            // ---------------------------------------------
        });


    }

    sendJsonData(data) {
        const jsonView = this._shadowroot.getElementById("json");
        jsonView.dispatchEvent(new CustomEvent("jsonData", {
			bubbles: true,
			composed: true,
			detail: {
				"message": data
			}
		}));
    }

});

const logPeriodicalInput = (socket, source, data, interval) => {
    setInterval(function () {
        socket.send(JSON.stringify({ "payload": "mqtt", "source": source, "data": data }));
    }, interval)
}