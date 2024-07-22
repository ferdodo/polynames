import type { Card, Round } from "../types";
import { PlayerRole } from "../types";

export function restrictCard(
	role: PlayerRole,
	rounds: Round[],
	cards: Partial<Card>[],
): Partial<Card>[] {
	const guessedCardIds = rounds.flatMap(
		(round) => round.cards?.map((card) => card.id) ?? [],
	);

	return cards.map((card) => {
		if (role === PlayerRole.WordMaster) {
			return card;
		}

		return guessedCardIds.includes(card.id)
			? card
			: { ...card, kind: undefined };
	});
}
