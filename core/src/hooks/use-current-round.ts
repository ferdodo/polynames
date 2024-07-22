import { useGame } from "../hooks";
import type { Round } from "../types";

export function useCurrentRound(): Round {
	const { rounds } = useGame();

	return rounds.sort((a, b) => a.position - b.position).findLast(Boolean);
}
