import { css } from "goober";
import { html } from "htm/preact";
import { appContext } from "../app-context";
import type { FrontContext } from "../types";
import { Board } from "./board";
import { HintPrompt } from "./hint-prompt";
import { Instructions } from "./instructions";
import { Lobby } from "./lobby";
import { Points } from "./points";
import { TurnIndicator } from "./turn-indicator";

interface AppProps {
	context: FrontContext;
	dataTestid: string;
}

export function App({ context, dataTestid }: AppProps) {
	const appContainer = css`
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	`;

	const appContent = css`
		grid-area: 1 / 1 / 2 / 2;
	`;

	return html`
		<${appContext.Provider} value=${context}>
			<div className=${appContainer}>
				<polynames-background
					className=${appContent}
					style="z-index: -1;">
				</polynames-background>

				<div
					className=${appContent}
					style="max-height: 100vh; overflow-y: auto;"
					data-testid=${dataTestid}>
					<polynames-title></polynames-title>
					<${TurnIndicator} />
					<${Instructions} />
					<${HintPrompt} />
					<${Lobby} />
					<${Board} />
					<${Points} />
				</div>
			</div>
		<//>
	`;
}
