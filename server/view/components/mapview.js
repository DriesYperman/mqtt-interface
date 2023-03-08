window.customElements.define('map-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.div = document.createElement('div');
        this.div.id = "container";
        this.div.innerHTML = `
        <button type="button" id="refresh" class="btn blue">refresh</button>
        <button type="button" id="enable" class="btn blue">enable scanning</button>
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
                border:none;
                
            }
            img {
                position: absolute;
                top: 60%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
            }
            .btn {
                border-radius: 5px;
                padding: 5px 5px;
                text-decoration: none;
                margin-left:5%;
                font-size: 15px;
                color: #fff;
                position: relative;
                display: inline-block;
                width:40%;
                
              }
              
              .btn:active {
                transform: translate(0px, 5px);
                -webkit-transform: translate(0px, 5px);
                box-shadow: 0px 1px 0px 0px;
              }
              
              .blue {
                background-color: #55acee;
                box-shadow: 0px 5px 0px 0px #3C93D5;
              }
              
              .blue:hover {
                background-color: #6FC6FF;
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