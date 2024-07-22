import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-card";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: {
				word: string;
			};
		}
	}
}

const template = createTemplate(html`
	<style>

  :host {
    display: inline-block;
  }

.abs,
h2:after,
.cards .card figcaption,
.cards .card:after,
.news .card figcaption,
.news .card:after,
.news .article figcaption {
  position: absolute;
}
.rel,
h2,
h2 strong,
.cards .card,
.news .card,
.news .article {
  position: relative;
}
.fix {
  position: fixed;
}
.dfix {
  display: inline;
}
.dib {
  display: inline-block;
}
.db {
  display: block;
}
.dn {
  display: none;
}
.df,
.cards,
.news {
  display: flex;
}
.dif {
  display: inline-flex;
}
.dg {
  display: grid;
}
.dig {
  display: inline-grid;
}
.vm,
h2,
h2 strong,
h2 span {
  vertical-align: middle;
}
body {
  background: #24282f;
  font-family: 'Alegreya Sans';
}
.wrapper {
  padding: 15px;
  padding: 0.2vw;
  transition: opacity 0.3s;
  text-align: left;
}
h2 {
  padding: 10px;
  padding-left: 25px;
  color: #ccc;
  margin: 0;
}
h2 strong {
  z-index: 2;
  background: #24282f;
  padding: 4px 8px;
}
h2 span {
  font-size: 0.7em;
  color: #aaa;
  margin-left: 10px;
}
h2:after {
  content: '';
  z-index: 1;
  bottom: 50%;
  margin-bottom: -2px;
  height: 2px;
  left: 0;
  right: 0;
  background: #373d47;
}
.cards,
.news {
  flex-flow: row wrap;
}
.cards .card,
.news .card {
  cursor: pointer;
  margin: 20px;
  width: 180px;
  /*height: 270px;*/
  max-height: 128px;
  height: 10vw;
  min-height: 105px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0,0,0,0.8);
  transform-origin: center top;
  transform-style: preserve-3d;
  transform: translateZ(0);
  transition: 0.3s;
}
.cards .card img,
.news .card img {
  width: 100%;
  min-height: 100%;
}
.cards .card figcaption,
.news .card figcaption {
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  padding-bottom: 10px;
  font-size: 20px;
  background: none;
  color: #fff;
  /*transform: translateY(100%);
  transition: 0.3s;*/
}
.cards .card:after,
.news .card:after {
  content: '';
  z-index: 10;
  width: 200%;
  height: 100%;
  top: -90%;
  left: -20px;
  opacity: 0.1;
  transform: rotate(45deg);
  background: linear-gradient(to top, transparent, #fff 15%, rgba(255,255,255,0.5));
  transition: 0.3s;
}
.cards .card:hover,
.news .card:hover,
.cards .card:focus,
.news .card:focus,
.cards .card:active,
.news .card:active {
  box-shadow: 0 8px 16px 3px rgba(0,0,0,0.6);
  transform: translateY(-3px) scale(1.05) rotateX(15deg);
}
.cards .card:hover figcaption,
.news .card:hover figcaption,
.cards .card:focus figcaption,
.news .card:focus figcaption,
.cards .card:active figcaption,
.news .card:active figcaption {
  transform: none;
}
.cards .card:hover:after,
.news .card:hover:after,
.cards .card:focus:after,
.news .card:focus:after,
.cards .card:active:after,
.news .card:active:after {
  transform: rotate(25deg);
  top: -40%;
  opacity: 0.15;
}
.news .article {
  overflow: hidden;
  width: 350px;
  height: 235px;
  margin: 20px;
}
.news .article img {
  width: 100%;
  min-height: 100%;
  transition: 0.2s;
}
.news .article figcaption {
  font-size: 14px;
  text-shadow: 0 1px 0 rgba(51,51,51,0.3);
  color: #fff;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 40px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
  background: rgba(6,18,53,0.6);
  opacity: 0;
  transform: scale(1.15);
  transition: 0.2s;
}
.news .article figcaption h3 {
  color: #3792e3;
  font-size: 16px;
  margin-bottom: 0;
  font-weight: bold;
}
.news .article:hover img,
.news .article:focus img,
.news .article:active img {
  filter: blur(3px);
  transform: scale(0.97);
}
.news .article:hover figcaption,
.news .article:focus figcaption,
.news .article:active figcaption {
  opacity: 1;
  transform: none;
}

  .anton-sc-regular {
  font-family: "Anton SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.85rem;
  letter-spacing: -0.3px;
}

.indie-flower-regular {
  font-family: "Indie Flower", cursive;
  font-weight: 400;
  font-style: normal;
}


	</style>

    <div className="wrapper">
        <div className="cards">
            <figure className="card">
                <polynames-background-squared/>
                <figcaption>
                  <span id="kindcaption" className="indie-flower-regular"></span>
                  <br/>
                  <span id="wordcaption" className="anton-sc-regular"></span>
                </figcaption>
            </figure>
        </div>
    </div>
`);

class Card extends HTMLElement {
	static get observedAttributes() {
		return ["word", "kind", "selected", "guessed"];
	}

	constructor() {
		super();
		let font = document.createElement("link");
		font.href =
			"https://fonts.googleapis.com/css2?family=Anton+SC&display=swap";
		font.rel = "stylesheet";
		document.head.appendChild(font);

		font = document.createElement("link");
		font.href =
			"https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap";
		font.rel = "stylesheet";
		document.head.appendChild(font);
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);

		const figcaption = shadowRoot.querySelector("#wordcaption");
		if (figcaption) {
			figcaption.textContent = `${this.getAttribute("word")}`;
		}

		const kindcaption = shadowRoot.querySelector("#kindcaption");
		const kind = this.getAttribute("kind");

		if (kindcaption) {
			kindcaption.textContent = `${kindDisplay(kind)}`;
		}

		const background = shadowRoot.querySelector("polynames-background-squared");
		if (background) {
			const attr = this.getAttribute("kind");
			if (attr) {
				background.setAttribute("kind", attr);
			} else {
				background.removeAttribute("kind");
			}
		}

		const card = shadowRoot.querySelector(".card") as HTMLElement;

		if (card) {
			card.style.boxShadow =
				this.getAttribute("selected") !== null
					? "rgba(56, 152, 255, 0.8) 0px 5px 50px"
					: "0 5px 10px rgba(0,0,0,0.8)";
		}

		const wrapper = shadowRoot.querySelector(".wrapper") as HTMLElement;
		const guessed = this.getAttribute("guessed") !== null;

		if (wrapper && guessed) {
			wrapper.style.opacity = "0.3";
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (this.shadowRoot && name === "word") {
			const shadowRoot = getShadowRoot(this);
			const figcaption = shadowRoot.querySelector("#wordcaption");
			if (figcaption) {
				figcaption.textContent = `${this.getAttribute("word")}`;
			}
		}

		if (this.shadowRoot && name === "kind") {
			const shadowRoot = getShadowRoot(this);
			const background = shadowRoot.querySelector(
				"polynames-background-squared",
			);
			if (background) {
				background.setAttribute("kind", newValue);
			}

			const kindcaption = shadowRoot.querySelector("#kindcaption");
			if (kindcaption) {
				kindcaption.textContent = `${kindDisplay(newValue)}`;
			}
		}

		if (this.shadowRoot) {
			const shadowRoot = getShadowRoot(this);
			const card = shadowRoot.querySelector(".card") as HTMLElement;

			if (card) {
				card.style.boxShadow =
					this.getAttribute("selected") !== null
						? "rgba(56, 152, 255, 0.8) 0px 5px 50px"
						: "0 5px 10px rgba(0,0,0,0.8)";
			}
		}

		if (this.shadowRoot && name === "guessed") {
			const shadowRoot = getShadowRoot(this);
			const wrapper = shadowRoot.querySelector(".wrapper") as HTMLElement;
			const guessed = this.getAttribute("guessed") !== null;

			if (wrapper) {
				wrapper.style.opacity = guessed ? "0.3" : "1";
			}
		}
	}
}

function kindDisplay(kind: any) {
	switch (kind) {
		case "Target":
			return "Bonne carte";
		case "Neutral":
			return "Neutre";
		case "Eliminatory":
			return "Éliminatoire";
		default:
			return "À deviner";
	}
}

customElements.define(tagName, Card);
