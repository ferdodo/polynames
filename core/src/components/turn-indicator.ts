import { html } from "htm/preact";
import { useFrontState, useGameState } from "../hooks";
import { GameState, PlayerRole } from "../types";

export function TurnIndicator() {
	const gameState = useGameState();
	const { role } = useFrontState();

	if (
		(role === PlayerRole.IntuitionMaster &&
			gameState === GameState.IntuitionMasterTurn) ||
		(role === PlayerRole.WordMaster && gameState === GameState.WordMasterTurn)
	) {
		return html`
			<polynames-turn-indicator style="width: 5rem;"></polynames-turn-indicator>
		`;
	}
}
