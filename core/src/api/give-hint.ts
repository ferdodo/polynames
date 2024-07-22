import type { FrontContext } from "../types";

export function giveHint(
	context: FrontContext,
	hint: string,
	count: number,
	signature: string,
	game: string,
) {
	context.connection.send({
		giveHintRequest: {
			hint,
			count,
			signature,
			game,
		},
	});
}
