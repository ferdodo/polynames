import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-font-prefetch";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>
	</style>

    <div style="opacity: 0.01">
        <polynames-title glossy="My Super" neon="Title !"></polynames-title>
        <polynames-instruction><span>Vous etes le Maitre des mots</span></polynames-instruction>
        <polynames-card word="voiture"></polynames-card>
        <polynames-input></polynames-input>
        <polynames-join-input></polynames-join-input>
        <polynames-point x="0" y="0">+1 Pt</polynames-point>
    </div>
`);

class FontPrefetch extends HTMLElement {
	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);
	}
}

customElements.define(tagName, FontPrefetch);
