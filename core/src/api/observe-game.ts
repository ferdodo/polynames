import type { Observable } from "rxjs";
import { filter, map } from "rxjs";
import type { BroadcastGame, FrontContext } from "../types";

export function observeGame(context: FrontContext): Observable<BroadcastGame> {
	return context.connection.messages$.pipe(
		map((message) => message.broadcastGame),
		filter(Boolean),
	);
}
