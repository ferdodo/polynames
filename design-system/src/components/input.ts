import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-input";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>
@import url(https://fonts.googleapis.com/css?family=Cabin:400);

.webdesigntuts-workshop {
	/*position: absolute;*/
	text-align: center;
}

.webdesigntuts-workshop:before,
.webdesigntuts-workshop:after {

}

.webdesigntuts-workshop:before {
	background: #444;
	background: linear-gradient(left, #151515, #444, #151515);
	/*top: 192px;*/
}

.webdesigntuts-workshop:after {
	background: linear-gradient(left, #151515, #000, #151515);	
	/*top: 191px;*/
}

.webdesigntuts-workshop form {
	background: #111;
	background: linear-gradient(#1b1b1b, #111);
	border: 1px solid #000;
	border-radius: 5px;
	box-shadow: inset 0 0 0 1px #272727;
	display: inline-block;
	font-size: 0px;
	margin: 150px auto 0;
	padding: 20px;
	position: relative;
	z-index: 1;
}

.webdesigntuts-workshop input {
	background: #222;	
	background: linear-gradient(#333, #222);	
	border: 1px solid #444;
	border-radius: 5px 0 0 5px;
	box-shadow: 0 2px 0 #000;
	color: #888;
	display: block;
	float: left;
	font-family: 'Cabin', helvetica, arial, sans-serif;
	font-size: 13px;
	font-weight: 400;
	height: 40px;
	margin: 0;
	padding: 0 10px;
	text-shadow: 0 -1px 0 #000;
	width: 200px;
}

.ie .webdesigntuts-workshop input {
	line-height: 40px;
}

.webdesigntuts-workshop input::-webkit-input-placeholder {
   color: #888;
}

.webdesigntuts-workshop input:-moz-placeholder {
   color: #888;
}

.webdesigntuts-workshop input:focus {
	animation: glow 800ms ease-out infinite alternate;
	background: #222922;
	background: linear-gradient(#333933, #222922);
	border-color: #393;
	box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 2px 0 #000;
	color: #efe;
	outline: none;
}

.webdesigntuts-workshop input:focus::-webkit-input-placeholder { 
	color: #efe;
}

.webdesigntuts-workshop input:focus:-moz-placeholder {
	color: #efe;
}

.webdesigntuts-workshop button {
	background: #222;
	background: linear-gradient(#333, #222);
	box-sizing: border-box;
	border: 1px solid #444;
	border-left-color: #000;
	border-radius: 0 5px 5px 0;
	box-shadow: 0 2px 0 #000;
	color: #fff;
	display: block;
	float: left;
	font-family: 'Cabin', helvetica, arial, sans-serif;
	font-size: 13px;
	font-weight: 400;
	height: 40px;
	line-height: 40px;
	margin: 0;
	padding: 0;
	position: relative;
	text-shadow: 0 -1px 0 #000;
	width: 80px;
}	

.webdesigntuts-workshop button:hover,
.webdesigntuts-workshop button:focus {
	background: #292929;
	background: linear-gradient(#393939, #292929);
	color: #5f5;
	outline: none;
}

.webdesigntuts-workshop button:active {
	background: #292929;
	background: linear-gradient(#393939, #292929);
	box-shadow: 0 1px 0 #000, inset 1px 0 1px #222;
	top: 1px;
}

@keyframes glow {
    0% {
		border-bottom-color: #393;
		/*box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 2px 0 #000;*/
    }	
    100% {
		border-bottom-color: #6f6;
		/*box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 2px 0 #000;*/
    }
}

	/* override */
	.webdesigntuts-workshop input {
		border-color: transparent;
		box-shadow: none;
		background: #ffffff0d;
		border-radius: initial;
		color: white;
		font-size: 1rem;
	}

	.webdesigntuts-workshop input:focus {
		box-shadow: none;
		background: #ffffff0d;
		border-radius: initial;
		border-top-color: transparent;
		border-right-color: transparent;
		border-left-color: transparent;
	}

	.webdesigntuts-workshop button {
		border-color: transparent;
		box-shadow: none;
		color: white;
		border-radius: initial;
		font-size: 1rem;
	}

	</style>
        <section className="webdesigntuts-workshop">
                <input id="hintinput" type="text" placeholder="Tapez un indice" style="width: 7.8rem"/>		    	
                <input id="countinput" type="text" placeholder="Nombre de mots" style="width: 8rem"/>
                <button>Search</button>
        </section>
`);

class PolynamesInput extends HTMLElement {
	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);

		const input = shadowRoot.querySelector("#hintinput");

		if (!input) {
			throw new Error("Input not found");
		}

		input.addEventListener("input", (event) => {
			const value = (event.target as HTMLInputElement).value;
			this.dispatchEvent(new CustomEvent("polynamesinput", { detail: value }));
		});

		const countinput = shadowRoot.querySelector("#countinput");

		if (!countinput) {
			throw new Error("Count input not found");
		}

		countinput.addEventListener("input", (event) => {
			const value = (event.target as HTMLInputElement).value;
			this.dispatchEvent(
				new CustomEvent("polynamescountinput", { detail: value }),
			);
		});

		const button = shadowRoot.querySelector("button");

		if (!button) {
			throw new Error("Button not found");
		}

		button.addEventListener("click", (event) => {
			this.dispatchEvent(new CustomEvent("polynamesclickbutton"));
		});
	}
}

customElements.define(tagName, PolynamesInput);
