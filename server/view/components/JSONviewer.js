window.customElements.define('json-Ƅ', class extends HTMLElement {

    style;

    #boxSize = 80;

    constructor() {
        super();

        this.div = document.createElement('div');
        this.div.id = "json-display";

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
                overflow: scroll;
            }
            #json-display {
                font-weight:bold;
            }
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.div);
        this._shadowroot.appendChild(this.style);

        this.addEventListener("jsonData", (e) => {
            const data = JSON.parse(e.detail.data);
            clearOutput(this.div);
            displayJsonData(data, this.div);
        });

    }

});

const displayJsonData = (data, container) => {
    const ul = document.createElement("ul");
    container.appendChild(ul);

    for (const key in data) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = key + ": ";
        li.appendChild(span);
        ul.appendChild(li);

        if (typeof data[key] === "object") {
            displayJsonData(data[key], li);
        } else {
            const value = document.createElement("span");
            value.textContent = data[key];
            li.appendChild(value);
        }
    }
}

const clearOutput = (element) => {
    element.innerHTML = "";
}