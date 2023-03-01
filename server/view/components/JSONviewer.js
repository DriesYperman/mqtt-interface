window.customElements.define('json-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.div = document.createElement('div');
        this.div.id = "test";
        this.div.innerHTML = `
            <pre id="json"></pre>
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
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.div);
        this._shadowroot.appendChild(this.style);

        this.addEventListener("jsonData", (e) => {
            const data = e.detail.message;
            this._shadowroot.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
        })

    }

});