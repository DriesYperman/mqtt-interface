// // get the base64 image data
// const base64ImageData = "data:image/png; " + [INCOMING_IMAGE];

// // create a new image element
// const imageElement = new Image();

// // set the source of the image element to the base64 image data
// imageElement.src = base64ImageData;

// // append the image element to the HTML document
// document.body.appendChild(imageElement);

window.customElements.define('map-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.imageElement = new Image();

        this.style = document.createElement('style');
        this.style.textContent = `
            :host {
                box-sizing: border-box;
                position: absolute;
                aspect-ratio: 1/1;
                border: 5px solid #bbb;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: ${this.#boxSize}%;
            }
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.imageElement);
        this._shadowroot.appendChild(this.style);

        this.addEventListener("jsonData", (e) => {
            const data = e.detail.message;
            this._shadowroot.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
        })

    }

});