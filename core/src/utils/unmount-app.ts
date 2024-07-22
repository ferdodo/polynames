import { render } from "preact";

export function unmountApp(target: HTMLElement) {
	render(null, target);
}
