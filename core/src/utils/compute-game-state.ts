import type { Card, Round } from "../types";
import { CardKind, GameState } from "../types";
import { computeCurrentRound } from "./compute-current-round";

export function computeGameState(
	rounds: Partial<Round>[],
	cards: Partial<Card>[],
): GameState {
	if (cards.length === 0) {
		return GameState.Available;
	}

	if (rounds.length === 0) {
		return GameState.WordMasterTurn;
	}

	const currentRound = computeCurrentRound(rounds);

	if (currentRound.skip) {
		return GameState.WordMasterTurn;
	}

	if (!currentRound?.cards?.length) {
		return GameState.IntuitionMasterTurn;
	}

	const foundCardTargetCount = rounds
		.flatMap((round) => round.cards || [])
		.filter((card) => card.kind === CardKind.Target).length;

	if (foundCardTargetCount >= 8) {
		return GameState.Finished;
	}

	if (currentRound?.cards?.some((card) => card.kind === CardKind.Eliminatory)) {
		return GameState.Finished;
	}

	if (currentRound?.cards?.some((card) => card.kind === CardKind.Neutral)) {
		return GameState.WordMasterTurn;
	}

	if (currentRound?.cards?.length > currentRound.count) {
		return GameState.WordMasterTurn;
	}

	return GameState.IntuitionMasterTurn;
}
