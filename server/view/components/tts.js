window.customElements.define('tts-Ƅ', class extends HTMLElement {

	style;

	#boxSize = 80;

	constructor() {
		super();

		this.form = document.createElement('form');
		this.form.id = 'tts_form';
		this.form.innerHTML = `
			<div class="brand-title">
      		<label>Text to speech:</label> 
			  </div>
			<input type="text" name="message" autocomplete="off"/>
      		<br/><br/>
      		<button type="submit">Send</button>
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
            }
		  
			#tts_form {
			    padding: 1rem;
			}
			input[type=text]{
				padding-left:10%;
			}
			input::placeholder {
				color: gray;
			  }
			input {
				margin-top:10%;
				background: #ecf0f3;
				padding: 10px;
				padding-left: 30%;
				height: 50px;
				font-size: 14px;
				border-radius: 50px;
				box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
			  }
			  label, input, button {
				display: block;
				width: 100%;
				padding: 0;
				border: none;
				outline: none;
				box-sizing: border-box;
			  }
			  button {
				color: white;
				margin-top: 20px;
				background: #1DA1F2;
				height: 40px;
				border-radius: 20px;
				cursor: pointer;
				font-weight: 900;
				box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
				transition: 0.5s;
			  }
			  
			  button:hover {
				box-shadow: none;
			  }
			  .brand-title {
				margin-top: 10px;
				font-weight: 900;
				font-size: 1.3rem;
				color: #555b5e;
				letter-spacing: 1px;
			  }
			  
		`;

		this._shadowroot = this.attachShadow({ mode: 'open' });
		this._shadowroot.appendChild(this.form);
		this._shadowroot.appendChild(this.style);

		this.form.addEventListener('submit', this.logSubmit.bind(this));
	}

	logSubmit(event) {
		event.preventDefault();
		const formData = new FormData(this.form);
		let message = "";
		for (const [key, value] of formData) {
			message = value
		}
		this.form.reset();
		
		this.dispatchEvent(new CustomEvent(this.id, {
			bubbles: true,
			composed: true,
			detail: {
				"message": message
			}
		}));
	}

});