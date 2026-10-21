import { randomUUID } from "crypto";
import { CardKind } from "core";
import type { Card } from "core";

export function createCard(): Card {
	return {
		id: randomUUID(),
		game: randomUUID(),
		word: "chat",
		kind: CardKind.Target,
	};
}
