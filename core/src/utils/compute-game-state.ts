import type { Card, Round } from "../types";
import { CardKind, GameState } from "../types";

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

	const lastRound = rounds
		.sort((a, b) => a.position - b.position)
		.findLast(Boolean);

	if (!lastRound?.cards?.length) {
		return GameState.IntuitionMasterTurn;
	}

	const foundCardTargetCount = rounds
		.flatMap((round) => round.cards || [])
		.filter((card) => card.kind === CardKind.Target).length;

	if (foundCardTargetCount >= 8) {
		return GameState.Finished;
	}

	if (lastRound?.cards?.some((card) => card.kind === CardKind.Eliminatory)) {
		return GameState.Finished;
	}

	if (lastRound?.cards?.some((card) => card.kind === CardKind.Neutral)) {
		return GameState.WordMasterTurn;
	}

	if (lastRound?.cards?.length > lastRound.count) {
		return GameState.WordMasterTurn;
	}

	return GameState.IntuitionMasterTurn;
}
