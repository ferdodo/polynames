import type { Round } from "../types";

export function computeCurrentRound(rounds: Partial<Round>[]): Partial<Round> {
	return rounds.sort((a, b) => a.position - b.position).findLast(Boolean);
}
