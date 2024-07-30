import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-turn-indicator";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>
		.dot-container {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(3, 1fr);
			user-select: none;
			aspect-ratio: 1 / 1;
		}

		.dot {
			height: 100%;
			width: 100%;
			border-radius: 50%;
			background: #00FFBD87;
			grid-area: 2 / 2 / 3 / 3;
		}

		.pulsating1 {
			animation: pulse 2s ease 0s infinite;
		}

		.pulsating2 {
			animation: pulse2 2s ease 0s infinite;
		}

		@keyframes pulse {
			0% {
				opacity: 1;
				transform: scale(1);
			}
			80% {
				opacity: 0;
				transform: scale(2.5);
			}
			100% {
				opacity: 0;
				transform: scale(3);
			}
		}

		@keyframes pulse2 {
			0% {
				opacity: 1;
				transform: scale(1);
			}
			30% {
				opacity: 1;
				transform: scale(1);
			}
			100% {
				opacity: 0;
				transform: scale(2.5);
			}
		}
	</style>

	<div className="dot-container" title="C'est votre tour !">
		<div className="dot pulsating1"></div>
		<div className="dot"></div>
		<div className="dot pulsating2"></div>
	</div>
`);

class TurnIndicator extends HTMLElement {
	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);
	}
}

customElements.define(tagName, TurnIndicator);
