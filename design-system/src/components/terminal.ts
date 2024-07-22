import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";

const html = htm.bind(h);
const tagName = "polynames-terminal";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>

* ############ MIXINS  ############## */
/* ############ END/MIXINS  ############## */
/* ############ COLORS  ############## */
/* ############ END/COLORS  ############## */
/* ############ TYPOGRAPHY  ############## */
h1 {
  font-family: "Black Ops One", cursive;
  font-size: 18px;
  margin: 10px;
}
@media (min-width: 768px) {
  h1 {
    font-size: 22px;
  }
}

h2 {
  font-family: "Black Ops One", cursive;
  font-size: 30px;
  margin: 10px;
}

a {
  color: #d9f2f4;
  text-decoration: none;
  transition: all 1s ease;
}
a.brackets {
  padding-bottom: 2px;
}
a.brackets::before {
  content: "[ ";
}
a.brackets::after {
  content: " ]";
}
a:hover, a:active, a:focus {
  background: #d9f2f4;
  color: black;
}

/* ############ END/TYPOGRAPHY  ############## */
/* ############ BUTTONS  ############## */
.btn {
  padding: 5px;
  margin: 5px;
  color: black;
  background: #93EDF5;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: none;
  font-weight: bold;
  border: 2px solid #93EDF5;
  -webkit-box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
  -moz-box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
  box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
}
.btn:hover {
  background: transparent;
  color: #93EDF5;
  text-shadow: 0px 0px 5px rgba(0, 255, 255, 0.83);
}

/* ############ END/BUTTONS  ############## */
/* ############ BASE  ############## */
.body {
  font-size: 16px;
  font-family: "Source Code Pro", monospace;
  color: #93EDF5;
  text-shadow: 0px 0px 5px rgba(0, 255, 255, 0.83);
  /*background: #051D29;*/
  -webkit-animation: ScanLine 10s ease-in-out infinite;
  -moz-animation: ScanLine 10s ease-in-out infinite;
  animation: ScanLine 10s ease-in-out infinite;
}
@-webkit-keyframes ScanLine {
  0% {
    opacity: 0.8;
  }
  10% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.9;
  }
  30% {
    opacity: 0.7;
  }
  40% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.9;
  }
}
@-moz-keyframes ScanLine {
  0% {
    opacity: 0.8;
  }
  10% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.9;
  }
  30% {
    opacity: 0.7;
  }
  40% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.9;
  }
}
@keyframes ScanLine {
  0% {
    opacity: 0.8;
  }
  10% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.9;
  }
  30% {
    opacity: 0.7;
  }
  40% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.9;
  }
}
@media (min-width: 769px) {
  body {
    background: #051D29 url("https://markostefanovic.github.io/random-quote-generator/images/back.png") repeat 300% 300%;
    -webkit-animation: ScanLine 10s ease-in-out infinite;
    -moz-animation: ScanLine 10s ease-in-out infinite;
    animation: ScanLine 10s ease-in-out infinite;
  }
  @-webkit-keyframes ScanLine {
    0% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
    10% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.7;
    }
    30% {
      opacity: 0.8;
    }
    40% {
      opacity: 0.9;
    }
    50% {
      background-position: 50% 100%;
      opacity: 1;
    }
    60% {
      opacity: 0.9;
    }
    70% {
      opacity: 0.6;
    }
    80% {
      opacity: 0.9;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
  }
  @-moz-keyframes ScanLine {
    0% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
    10% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.7;
    }
    30% {
      opacity: 0.8;
    }
    40% {
      opacity: 0.9;
    }
    50% {
      background-position: 50% 100%;
      opacity: 1;
    }
    60% {
      opacity: 0.9;
    }
    70% {
      opacity: 0.6;
    }
    80% {
      opacity: 0.9;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
  }
  @keyframes ScanLine {
    0% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
    10% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.7;
    }
    30% {
      opacity: 0.8;
    }
    40% {
      opacity: 0.9;
    }
    50% {
      background-position: 50% 100%;
      opacity: 1;
    }
    60% {
      opacity: 0.9;
    }
    70% {
      opacity: 0.6;
    }
    80% {
      opacity: 0.9;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      background-position: 51% 0%;
      opacity: 0.9;
    }
  }
}

.border.blue {
  border: 2px solid #4BA0E3;
  -webkit-box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78), inset 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
  -moz-box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78), inset 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
  box-shadow: 0px 0px 4px 2px rgba(16, 81, 139, 0.78), inset 0px 0px 4px 2px rgba(16, 81, 139, 0.78);
}
.border.red {
  border: 2px solid #D4AFB9;
  -webkit-box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
  -moz-box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
  box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
}

.cursor {
  color: #93EDF5;
  background: transparent;
  text-shadow: 0px 0px 5px rgba(0, 255, 255, 0.83);
  -webkit-animation: Blink 2s ease infinite;
  -moz-animation: Blink 2s ease infinite;
  animation: Blink 2s ease infinite;
}
@-webkit-keyframes Blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes Blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes Blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.float-left {
  /*float: left;*/
}

.clear {
  clear: both;
}

/* ############ END/BASE  ############## */
/* ############ CONTAINER  ############## */
.container {
  max-width: 800px;
  margin: 0 auto;
  min-width: 300px;
}
.container .wrapper {
  padding: 2px;
  -webkit-animation: Glitch 10s ease-in-out infinite;
  -moz-animation: Glitch 10s ease-in-out infinite;
  animation: Glitch 10s ease-in-out infinite;
}
@-webkit-keyframes Glitch {
  9.9% {
    -webkit-transform: skew(0deg);
  }
  10% {
    -webkit-transform: skew(1deg);
  }
  10.1% {
    -webkit-transform: skew(0deg);
  }
  89.9% {
    -webkit-transform: skew(0deg);
  }
  90% {
    -webkit-transform: skew(-4deg);
  }
  90.1% {
    -webkit-transform: skew(0deg);
  }
}
@-moz-keyframes Glitch {
  9.9% {
    -webkit-transform: skew(0deg);
  }
  10% {
    -webkit-transform: skew(1deg);
  }
  10.1% {
    -webkit-transform: skew(0deg);
  }
  89.9% {
    -webkit-transform: skew(0deg);
  }
  90% {
    -webkit-transform: skew(-4deg);
  }
  90.1% {
    -webkit-transform: skew(0deg);
  }
}
@keyframes Glitch {
  9.9% {
    -webkit-transform: skew(0deg);
  }
  10% {
    -webkit-transform: skew(1deg);
  }
  10.1% {
    -webkit-transform: skew(0deg);
  }
  89.9% {
    -webkit-transform: skew(0deg);
  }
  90% {
    -webkit-transform: skew(-4deg);
  }
  90.1% {
    -webkit-transform: skew(0deg);
  }
}

/* ############ END/CONTAINER  ############## */
/* ############ QUOTE - MACHINE  ############## */
.quote-machine {
  /*float: left;*/
  margin: 5px;
  width: 95vw;
}
@media (min-width: 768px) {
  .quote-machine {
    width: 600px;
  }
}

header {
  margin-bottom: 2px;
  min-height: 50px;
  position: relative;
}
header span {
  position: absolute;
  right: 5px;
  bottom: 5px;
}

main {
  margin-bottom: 2px;
  padding: 5px;
  position: relative;
  /*min-height: 300px;*/
}
@media (max-width: 767px) and (orientation: landscape) {
  main {
    min-height: 170px;
  }
}
main blockquote {
  position: relative;
  /*min-height: 130px;*/
  margin: 10px;
}
main blockquote .author {
  margin-top: 10px;
  float: right;
}
main blockquote .warning {
  padding-top: 10px;
  text-align: center;
}
main blockquote .warning > span {
  color: black;
  background: #D4AFB9;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: none;
}
main .block {
  position: absolute;
  bottom: 15px;
}

.page-author {
  text-align: center;
}

footer {
  padding-top: 5px;
}

/* ############ END/QUOTE - MACHINE  ############## */
/* ############ MEMORY MODULE  ############## */
.mem {
  width: 105px;
  margin: 5px;
  padding: 2px;
  /*float: left;*/
}
.mem ul {
  padding-left: 2px;
  padding-top: 2px;
}
.mem ul li {
  list-style: none;
  display: inline-block;
  margin: -4px;
}
.mem .module {
  margin: 3px;
  width: 6px;
  height: 16px;
  display: inline-block;
  background: #93EDF5;
  border: 2px solid #93EDF5;
  -webkit-box-shadow: 0px 0px 2px 1px rgba(0, 255, 255, 0.83);
  -moz-box-shadow: 0px 0px 2px 1px rgba(0, 255, 255, 0.83);
  box-shadow: 0px 0px 2px 1px rgba(0, 255, 255, 0.83);
}
.mem header {
  margin: 5px 5px 5px 0;
  min-height: 20px;
}
.mem header h2 {
  font-size: 30px;
  margin: 5px;
}
.mem .cell {
  float: left;
}
.mem .opened {
  color: #D4AFB9;
  text-shadow: 0px 0px 5px rgba(240, 93, 94, 0.78);
}
.mem .opened .module {
  transition: background 2s, border 2s;
  background: #D4AFB9;
  border: 2px solid #D4AFB9;
  -webkit-box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
  -moz-box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
  box-shadow: 0px 0px 2px 1px rgba(240, 93, 94, 0.78);
}

/* ############ END/MEMORY MODULE  ############## */

	</style>

<div className="body">
<div className="container">
    <!-- random quote machine -->
    <div className="wrapper quote-machine border blue">
      <header className="border blue">
        <h1 id="titleprop"></h1>
        <span className="version border blue">ver:1.1</span>
      </header>
      <main className="border blue">
        <blockquote id="quote"><slot></slot></blockquote>
      </main>
      <footer className="border blue">
        <p id="footerprop" className="page-author"></p>
      </footer>
    </div>

</div>
</div>
`);

class Terminal extends HTMLElement {
	static get observedAttributes() {
		return ["title", "footer"];
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);

		const titleprop = shadowRoot.getElementById("titleprop") as HTMLElement;

		if (this.hasAttribute("title")) {
			titleprop.textContent = this.getAttribute("title") || "";
		}

		const footerprop = shadowRoot.getElementById("footerprop") as HTMLElement;

		if (this.hasAttribute("footer")) {
			footerprop.textContent = this.getAttribute("footer") || "";
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === "title" && this.shadowRoot) {
			const shadowRoot = getShadowRoot(this);
			const titleprop = shadowRoot.getElementById("titleprop") as HTMLElement;
			titleprop.textContent = newValue || "";
		}

		if (name === "footer" && this.shadowRoot) {
			const shadowRoot = getShadowRoot(this);
			const footerprop = shadowRoot.getElementById("footerprop") as HTMLElement;
			footerprop.textContent = newValue || "";
		}
	}
}

customElements.define(tagName, Terminal);
