import { filter, firstValueFrom, map } from "rxjs";
import type { FrontContext, JoinGameResponse } from "../types";

export function joinGame(
	context: FrontContext,
	game: string,
): Promise<JoinGameResponse> {
	const response$ = context.connection.messages$.pipe(
		map((message) => message.joinGameResponse),
		filter(Boolean),
	);

	const waitResponse = firstValueFrom(response$).catch(() => {
		throw new Error("Failed to join game !");
	});

	context.connection.send({
		joinGameRequest: {
			game,
		},
	});

	return waitResponse;
}
