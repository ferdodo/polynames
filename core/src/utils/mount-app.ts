import { html } from "htm/preact";
import { render } from "preact";
import { App } from "../components/app";
import type { FrontContext } from "../types";

export function mountApp(target: HTMLElement, context: FrontContext) {
	render(html`<${App} context=${context} />`, target);
}
