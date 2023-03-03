window.customElements.define('json-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.pre = document.createElement('pre');
        this.pre.id = "jsonData";

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
            pre{
                margin-left:10%;
                margin-right:10%;
                font-weight:bold;
            }
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.pre);
        this._shadowroot.appendChild(this.style);

        this.addEventListener("jsonData", (e) => {
            this.pre.innerHTML = e.detail.data;
        })

    }

});