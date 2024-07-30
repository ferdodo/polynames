import { useGame } from "../hooks";
import type { Round } from "../types";
import { computeCurrentRound } from "../utils";

export function useCurrentRound(): Partial<Round> {
	const { rounds } = useGame();
	return computeCurrentRound(rounds);
}
