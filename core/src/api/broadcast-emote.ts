import type { Connection } from "connection-types";
import { filter, lastValueFrom, map, tap } from "rxjs";
import type { Observable } from "rxjs";
import type { BackContext, EmitEmote, Message } from "../types";
import { takeUntilConnectionClosed } from "../utils";

export async function broadcastEmote(
	context: BackContext,
	a: Connection<Message>,
	b: Connection<Message>,
): Promise<void> {
	await Promise.all([
		lastValueFrom(forwardEmote(context, a, b), { defaultValue: {} }),
		lastValueFrom(forwardEmote(context, b, a), { defaultValue: {} }),
	]);
}

function forwardEmote(
	{ hasInvalidRole }: BackContext,
	connectionA: Connection<Message>,
	connectionB: Connection<Message>,
): Observable<EmitEmote> {
	return connectionA.messages$.pipe(
		map((message) => message.emitEmote),
		filter(Boolean),
		tap(async ({ game, role, signature, emote }) => {
			if (await hasInvalidRole(game, role, signature)) {
				return;
			}

			connectionB.send({
				broadcastEmote: {
					emote,
					role,
				},
			});
		}),
		takeUntilConnectionClosed(connectionA),
		takeUntilConnectionClosed(connectionB),
	);
}
