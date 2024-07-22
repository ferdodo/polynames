import { useGame } from "../hooks";
import type { GameState } from "../types";
import { computeGameState } from "../utils";

export function useGameState(): GameState {
	const { cards, rounds } = useGame();
	const gameState = computeGameState(rounds, cards);
	return gameState;
}
