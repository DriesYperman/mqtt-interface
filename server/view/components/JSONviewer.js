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
            #test{
                padding-right:20%;
                padding-left:10%;
                padding-top:3%;
            }
		`;

        this._shadowroot = this.attachShadow({ mode: 'open' });
        this._shadowroot.appendChild(this.div);
        this._shadowroot.appendChild(this.style);

        this.addEventListener("jsonData", (e) => {
            const data = e.detail.message;
            const response = JSON.stringify(data)
            const answer = response.replace(/[,]/g, "<br>");
            const answer2  = answer.replace(/[{}]/g, "");
            const answer3  = answer2.replace(/["]/g, "")

            const final = String(answer)
           // const finalfinal= final.replace(/)
            console.log(final);
            this._shadowroot.getElementById("json").innerHTML = answer3;

        })

    }

});