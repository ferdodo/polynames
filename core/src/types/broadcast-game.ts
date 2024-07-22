import type { Card, Round } from ".";

export interface BroadcastGame {
	rounds: Round[];
	cards: Partial<Card>[];
}
