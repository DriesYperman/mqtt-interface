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

        this.div = document.createElement('div');
        this.div.id = "container";
        this.div.innerHTML = `
            <button type="button" id="refresh">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
            </button>
            <img id="mapview">
        `;

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
            img {
                width: 100%;
            }
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.div);
        this._shadowroot.appendChild(this.style);

        const refreshBtn = this._shadowroot.getElementById("refresh");
        refreshBtn.addEventListener('click', () => {
            this.requestMap();
        })

        this.addEventListener("jsonData", (e) => {
            const data = e.detail.data;
            this._shadowroot.getElementById("mapview").src = `data:image/png;base64, ${data}`;
        })

    }

    requestMap() {
        this.dispatchEvent(new CustomEvent('mapRequest', {
            bubbles: true,
            composed: true,
        }));
    }

});