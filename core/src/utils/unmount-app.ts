import { render } from "preact";

export function unmountApp(target: HTMLElement): void {
	render(null, target);
}
