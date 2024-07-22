import htm from "htm/mini";
import h from "hyperscript";
import { createTemplate, getShadowRoot } from "../utils";
import { Observable } from "rxjs";

const html = htm.bind(h);
const tagName = "polynames-instruction";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			[tagName]: undefined;
		}
	}
}

const template = createTemplate(html`
	<style>
html,
body {
  background: #212121;
  height: 100%;

}
.container {
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: "Mochiy Pop One", sans-serif;
  font-family: "Viga", sans-serif;
  /*font-family: "Chakra Petch", sans-serif;*/
  font-weight: 100;
  font-style: normal;
  padding: 2rem;

}
.text {
  font-weight: 100;
  font-size: 28px;
  color: #fafafa;
  text-shadow: 1px 1px 2px black;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3), 0 3px 0px rgba(0, 0, 0, 0.3);
    transform: translateY(3px);
  }
  50% {
    text-shadow: 0 5px 5px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.3), 0 5px 20px rgba(0, 0, 0, 0.3), 0 5px 25px rgba(0, 0, 0, 0.3), 0 5px 30px rgba(0, 0, 0, 0.3), 0 5px 35px rgba(0, 0, 0, 0.3), 0 5px 40px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }
}




.glowing-text {
  color: #fff;
  text-align: center;
  animation: glow 12s cubic-bezier(.69,.17,.27,.91) infinite alternate;
}

.dud {
  color: #757575;
}

	</style>

    <div className="container">
    <div className="text glowing-text vertical-translate"></div>
    
    <div style="display: none;">
        <slot></slot>
    </div>
    </div>
`);

// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

interface QueueElement {
	from: string;
	to: string;
	start: number;
	end: number;
	char?: string;
}

class TextScramble {
	queue: QueueElement[] = [];
	el: HTMLElement;
	chars: string;
	resolve: ((value: unknown) => void) | undefined;
	frame = 0;
	frameRequest = 0;

	constructor(el: HTMLElement) {
		this.el = el;
		this.chars = "abcdefghijklmnopqrstuvwxyz";
		this.update = this.update.bind(this);
	}
	setText(newText: string) {
		const oldText = this.el.innerText;
		const length = Math.max(oldText.length, newText.length);

		const promise = new Promise((resolve) => {
			this.resolve = resolve;
			return this.resolve;
		});

		this.queue = [];

		for (let i = 0; i < length; i++) {
			const from = oldText[i] || "";
			const to = newText[i] || "";
			const start = Math.floor(Math.random() * 40);
			const end = start + Math.floor(Math.random() * 40);
			this.queue.push({ from, to, start, end });
		}
		cancelAnimationFrame(this.frameRequest);
		this.frame = 0;
		this.update();
		return promise;
	}
	update() {
		let output = "";
		let complete = 0;
		for (let i = 0, n = this.queue.length; i < n; i++) {
			let { from, to, start, end, char } = this.queue[i];
			if (this.frame >= end) {
				complete++;
				output += to;
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar();
					this.queue[i].char = char;
				}
				output += `<span class="dud">${char}</span>`;
			} else {
				output += from;
			}
		}
		this.el.innerHTML = output;
		if (complete === this.queue.length) {
			this.resolve?.(undefined);
		} else {
			this.frameRequest = requestAnimationFrame(this.update);
			this.frame++;
		}
	}
	randomChar() {
		return this.chars[Math.floor(Math.random() * this.chars.length)];
	}
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

function getSlotContentAsText(shadowRoot: ShadowRoot): string {
	const slot = shadowRoot.querySelector<HTMLSlotElement>("slot");
	if (!slot) {
		throw new Error("slot not found !");
	}

	const assignedNodes = slot.assignedNodes({ flatten: true }) as Node[];
	const spanContents = assignedNodes
		.map((node) => (node as HTMLElement).textContent || "")
		.filter(Boolean)
		.join("");

	return spanContents;
}

function observeSlotContentChange(shadowRoot: ShadowRoot) {
	return new Observable((obs) => {
		const slot = shadowRoot.querySelector<HTMLSlotElement>("slot");
		if (!slot) {
			throw new Error("slot not found !");
		}

		const slotSpans = slot.assignedNodes({ flatten: true }) as Node[];

		for (const span of [slot, ...slotSpans]) {
			const observer = new MutationObserver(() => {
				obs.next(undefined);
			});

			observer.observe(span, {
				childList: true,
				subtree: true,
				characterData: true,
			});
		}
	});
}

class Instructions extends HTMLElement {
	constructor() {
		super();
		const font = document.createElement("link");
		//font.href =
		//	"https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap";
		font.href = "https://fonts.googleapis.com/css2?family=Viga&display=swap";
		//font.href =
		//	"https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap";
		font.rel = "stylesheet";
		document.head.appendChild(font);
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const clonedTemplate = template.content.cloneNode(true);
		shadowRoot.appendChild(clonedTemplate);
		await this.render();

		const slot = shadowRoot.querySelector<HTMLSlotElement>("slot");
		if (!slot) {
			throw new Error("slot not found !");
		}

		observeSlotContentChange(shadowRoot).subscribe(() => {
			this.render();
		});
	}

	async render() {
		const shadowRoot = getShadowRoot(this);
		const el = shadowRoot.querySelector(".text") as HTMLElement | null;

		if (!el) {
			throw new Error("text not found !");
		}

		const fx = new TextScramble(el);

		await fx.setText(getSlotContentAsText(shadowRoot));
	}
}

customElements.define(tagName, Instructions);
