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

	const waitResponse = firstValueFrom(response$, {
		defaultValue: {} as JoinGameResponse,
	}).catch((cause) => {
		throw new Error("Failed to join game !", { cause });
	});

	context.connection.send({
		joinGameRequest: {
			game,
		},
	});

	return waitResponse;
}
