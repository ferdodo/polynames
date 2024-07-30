import { html } from "htm/preact";
import { useContext } from "preact/hooks";
import { skipRoundRequest } from "../api";
import { appContext } from "../app-context";
import { useFrontState, useGameState } from "../hooks";
import { GameState, PlayerRole } from "../types";

export function SkipRound() {
	const context = useContext(appContext);
	const { game, role, signature } = useFrontState();
	const gameState = useGameState();

	if (
		role !== PlayerRole.IntuitionMaster ||
		gameState !== GameState.IntuitionMasterTurn
	) {
		return html`<span></span>`;
	}

	const handleClickSkipRound = () => {
		skipRoundRequest(context, game, signature);
	};

	return html`
        <polynames-button onClick=${handleClickSkipRound}> Passer le tour </polynames-button>
    `;
}
