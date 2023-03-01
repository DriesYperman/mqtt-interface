window.customElements.define('joystick-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;
    #knobSize = 40;

    #knobInfo;
    #boxInfo;

    #isDragging = false;
    #mov = { "x": 0, "y": 0 };
    #grab_delta = { "x": 0, "y": 0 };

    constructor() {
        super();

        this.knob = document.createElement('div');
        this.knob.id = 'knob';

        this.style = document.createElement('style');
        this.style.textContent = `
            :host {
                box-sizing: border-box;
                position: absolute;
                aspect-ratio: 1/1;
                background: #ecf0f3;
                box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
                border-radius: 20px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: ${this.#boxSize}%;
              }
          
              #knob {
                width: ${this.#knobSize}%;
                height: ${this.#knobSize}%;
                border-radius: 50%;
                background-color: #1DA1F2;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s;
                transition-timing-function: ease-out;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
              }
             }
        `;



        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.knob);
        this._shadowroot.appendChild(this.style);

        this.addEventListener('mousedown', this.startDrag.bind(this));
        this.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));

        this.addEventListener('touchstart', this.startDrag.bind(this));
        this.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));

        // document.addEventListener('DOMContentLoaded', () => {
        // });

        addEventListener("resize", (event) => { this.resetKnob(); });

    }

    startDrag(event) {
        this.#knobInfo = getInfo(this.knob);
        this.#boxInfo = getInfo(this);
        const mouse = getPosition(event);
        const coords = toLocalCoords(mouse, this.#knobInfo.center);

        if (insideBounds(coords.x, coords.y, this.#knobInfo.width / 2)) {
            event.preventDefault();
            this.#isDragging = true;

            this.#grab_delta.x = coords.x;
            this.#grab_delta.y = coords.y;
        }
    }

    drag(event) {
        if (this.#isDragging) {
            event.preventDefault();
            const mouse = getPosition(event);
            const coords = toLocalCoords(mouse, this.#knobInfo.center);

            this.#mov.x = coords.x - this.#grab_delta.x;
            this.#mov.y = coords.y - this.#grab_delta.y;

            if (insideBounds(this.#mov.x, this.#mov.y, this.#boxInfo.width / 2)) moveKnob(this, this.#mov.x, -this.#mov.y);
        }
    }

    stopDrag(event) {
        this.#isDragging = false;
        this.resetKnob();
    }

    resetKnob() {
        this.#mov.x = 0;
        this.#mov.y = 0;
        moveKnob(this, this.#mov.x, this.#mov.y);
    }

});

// "static" functions

const getPosition = (event) => {
    const mouse_x = event.clientX || event.touches[0].clientX;
    const mouse_y = event.clientY || event.touches[0].clientY;
    return { "x": mouse_x, "y": mouse_y };
}

const getInfo = (element) => {
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const center = {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
    };
    return { "center": center, "width": width, "height": height };
}

const toLocalCoords = (coords, center) => {
    return {
        x: coords.x - center.x,
        y: center.y - coords.y
    }
}

const toGlobalCoords = (coords, center) => {
    return {
        x: coords.x + center.x,
        y: center.y - coords.y
    }
}

const insideBounds = (x, y, r) => {
    if (x > r || x < -r) return false;
    if (y > r || y < -r) return false;
    return true;
}

const moveKnob = (component, x, y) => {
    const knobInfo = getInfo(component.knob);
    component.knob.style.transform = `translate3d(${x - knobInfo.width / 2}px, ${y - knobInfo.width / 2}px, 0)`;
    component.knob.dispatchEvent(new CustomEvent(component.id, {
        bubbles: true,
        composed: true,
        detail: {
            "x": x,
            "y": -y
        }
    }));
}