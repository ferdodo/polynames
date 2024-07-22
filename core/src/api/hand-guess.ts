import type { Card, FrontContext } from "../types";

export function handGuess(
	context: FrontContext,
	game: string,
	cards: Partial<Card>[],
	signature: string,
) {
	context.connection.send({
		handGuessRequest: {
			game,
			cards,
			signature,
		},
	});
}
