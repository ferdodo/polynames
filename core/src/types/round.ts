import type { Card } from ".";

export interface Round {
	id: string;
	game: string;
	position: number;
	count: number;
	hint: string;
	cards?: Partial<Card>[];
	skip: boolean;
}
