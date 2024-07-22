import type { Round } from "../types";
import { CardKind } from "../types";

export function computePoints(rounds: Round[]) {
	let points = 0;

	for (const round of rounds) {
		let targetCount = 0;

		if (!round.cards) {
			continue;
		}

		for (const card of round.cards) {
			if (card.kind === CardKind.Target) {
				targetCount++;

				points +=
					targetCount > round.count ? targetCount * targetCount : targetCount;
			}
		}
	}

	return points;
}
