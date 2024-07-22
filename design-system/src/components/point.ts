import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-point";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>
		@keyframes moveUpAndFade {
			0% {
				transform: translateY(0) rotate(10deg);
				opacity: 1;
			}
			100% {
				transform: translateY(-30px) rotate(10deg);
				opacity: 0;
			}
		}

		.point-initial {
			display: none;
		}

		.fade-up {
			display: initial;
			animation: moveUpAndFade 2s forwards;
			position: absolute;
			z-index: 1;
			color: white;
			text-shadow: 
				1px 1px 2px black, 
				2px 2px 2px black, 
				3px 3px 2px black, 
				4px 4px 2px black,
				5px 5px 2px black;
			font-size: 3rem;
			font-family: Viga, sans-serif;
		}
	</style>

	<span  id="fadeUpText" className="point-initial"><slot></slot></span>
`);

class Point extends HTMLElement {
	static get observedAttributes() {
		return ["x", "y"];
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);
	}

	render() {
		const shadowRoot = getShadowRoot(this);
		const fadeUpText = shadowRoot.getElementById("fadeUpText");

		if (!fadeUpText) {
			throw new Error("Element not found");
		}

		const xAttr = this.getAttribute("x");
		const yAttr = this.getAttribute("y");

		const x = xAttr ? Number.parseInt(xAttr) : 0;
		const y = yAttr ? Number.parseInt(yAttr) : 0;

		if (x || y) {
			fadeUpText.style.left = `${x}px`;
			fadeUpText.style.top = `${y}px`;
			fadeUpText.style.display = "inline";
			fadeUpText.classList.remove("fade-up");
			void fadeUpText.offsetWidth;
			fadeUpText.classList.add("fade-up");
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}
}

customElements.define(tagName, Point);
