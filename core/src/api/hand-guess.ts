import type { Card, FrontContext } from "../types";

export function handGuess(context: FrontContext, card: Partial<Card>) {
	const { game, signature } = context.frontStateStorage.read();

	if (!game) {
		throw new Error("Game is missing !");
	}

	if (!signature) {
		throw new Error("Signature is missing !");
	}

	context.connection.send({
		handGuessRequest: {
			game,
			cards: [card],
			signature,
		},
	});
}
