import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-background-squared";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: { kind: string };
		}
	}
}

const template = createTemplate(html`
	<style>
* {
  margin: 0;
  padding: 0;
}

.banner-text {
  width: 100%;
  position: absolute;
  z-index: 1;
}
.banner-text ul {
  height: 50px;
  float: right;
}
.banner-text ul li {
  display: inline-block;
  padding: 40px 15px;
  text-transform: uppercase;
  color: #fff;
  font-size: 20px;
}
.banner-text ul li:hover {
  cursor: pointer;
}
.banner-text h2 {
  text-align: center;
  color: #fff;
  font-size: 50px;
  margin-top: 20%;
}
.animation-area {
  background: #fdc830;
  background: -webkit-linear-gradient(to right, #f37335, #fdc830);
  background: linear-gradient(to right, #f37335, #fdc830);
  width: 100%;
  height: 100vh;
}
.box-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.box-area li {
  position: absolute;
  display: block;
  list-style: none;
  width: 25px;
  height: 25px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 400s linear infinite;
  bottom: -150px;
}
.box-area li:nth-child(1) {
  left: 86%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}
.box-area li:nth-child(2) {
  left: 12%;
  width: 30px;
  height: 30px;
  animation-delay: 1.5s;
  animation-duration: 100s;
}
.box-area li:nth-child(3) {
  left: 70%;
  width: 100px;
  height: 100px;
  animation-delay: 5.5s;
}
.box-area li:nth-child(4) {
  left: 42%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 150s;
}
.box-area li:nth-child(5) {
  left: 65%;
  width: 40px;
  height: 40px;
  animation-delay: 0s;
}
.box-area li:nth-child(6) {
  left: 15%;
  width: 110px;
  height: 110px;
  animation-delay: 3.5s;
}
@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-800px) rotate(360deg);
    opacity: 0;
  }
}
	</style>

    <div className="animation-area">
    <ul className="box-area">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    </div>
`);

class BackgroundSquared extends HTMLElement {
	static get observedAttributes() {
		return ["kind"];
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);

		this.render();
	}

	render() {
		const shadowRoot = getShadowRoot(this);

		// random animation durations
		const boxAreali = [
			".box-area li:nth-child(1)",
			".box-area li:nth-child(2)",
			".box-area li:nth-child(3)",
			".box-area li:nth-child(4)",
			".box-area li:nth-child(5)",
			".box-area li:nth-child(6)",
		];

		for (const selector of boxAreali) {
			const boxAreali = shadowRoot.querySelector(selector) as HTMLElement;

			if (boxAreali) {
				boxAreali.style.animationDuration = `${Math.random() * 80 + 40}s`;
				boxAreali.style.animationDelay = `${Math.random() * 120}s`;
				const size = Math.random() * 120 + 30;
				boxAreali.style.width = `${size}px`;
				boxAreali.style.height = `${size}px`;
			}
		}

		const animationAera = shadowRoot.querySelector(
			".animation-area",
		) as HTMLElement;

		if (animationAera) {
			const kind = this.getAttribute("kind");

			if (kind === "Target") {
				animationAera.style.background = "#fdc830";
				animationAera.style.background =
					"-webkit-linear-gradient(to right, rgba(191, 81, 0, 0.71), rgba(253, 183, 48, 0.99))";
				animationAera.style.background =
					"linear-gradient(to right, rgba(191, 81, 0, 0.71), rgba(253, 183, 48, 0.99))";
			} else if (kind === "Eliminatory") {
				animationAera.style.background = "#000";
				animationAera.style.background =
					"-webkit-linear-gradient(to right, rgb(28, 28, 28), rgb(47, 47, 47))";
				animationAera.style.background =
					"linear-gradient(to right, rgb(28, 28, 28), rgb(47, 47, 47))";
			} else if (kind === "Neutral") {
				animationAera.style.background = "rgba(138, 126, 101, 0.84)";
				animationAera.style.background =
					"-webkit-linear-gradient(to right, rgba(168, 134, 53, 0.15), rgba(138, 126, 101, 0.84)";
				animationAera.style.background =
					"linear-gradient(to right, rgba(168, 134, 53, 0.15), rgba(138, 126, 101, 0.84))";
			} else {
				//blue-ish
				animationAera.style.background = "rgba(31, 41, 193, 0.48)";
				animationAera.style.background =
					"-webkit-linear-gradient(to right, rgba(31, 41, 193, 0.48), rgba(48, 109, 253, 0.69))";
				animationAera.style.background =
					"linear-gradient(to right, rgba(31, 41, 193, 0.48), rgba(48, 109, 253, 0.69))";
			}
		} else {
			console.error("animation-area not found");
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}
}

customElements.define(tagName, BackgroundSquared);
