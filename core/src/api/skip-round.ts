import type { FrontContext } from "../types";

export function skipRoundRequest(
	context: FrontContext,
	game: string,
	signature: string,
): void {
	context.connection.send({
		skipRoundRequest: {
			game,
			signature,
		},
	});
}
