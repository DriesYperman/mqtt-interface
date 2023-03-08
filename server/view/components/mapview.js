window.customElements.define('map-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.div = document.createElement('div');
        this.div.id = "container";
        this.div.innerHTML = `
        <button type="button" id="refresh">refresh</button>
        <button type="button" id="enable">enable scanning</button>
        <img id="mapview">
        `;

        this.style = document.createElement('style');
        this.style.textContent = `
            :host {
                box-sizing: border-box;
                position: absolute;
                aspect-ratio: 1/1;
                border-radius: 20px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: ${this.#boxSize}%;
                background: #ecf0f3;
                box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
                text-align: center;
            }
            button {
                padding: .5rem;
                margin: .5rem;
                cursor: pointer;
            }
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
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

        const enableBtn = this._shadowroot.getElementById("enable");
        enableBtn.addEventListener('click', () => {
            this.enableScanning();
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
    
    enableScanning() {
        this.dispatchEvent(new CustomEvent('enableScanning', {
            bubbles: true,
            composed: true,
        }));
    }

});