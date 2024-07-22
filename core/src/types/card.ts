import type { CardKind } from "./card-kind";

export interface Card {
	id: string;
	game: string;
	word: string;
	kind: CardKind;
}
