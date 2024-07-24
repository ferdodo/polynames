import type { Connection } from "connection-types";
import { combineLatest, from, lastValueFrom, merge, tap } from "rxjs";
import { restrictCard } from "../permissions";
import type { BackContext, Card, Message, Round } from "../types";
import type { PlayerRole } from "../types";
import { takeUntilConnectionClosed } from "../utils/take-until-connection-closed";

export async function broadCastGame(
	connection: Connection<Message>,
	context: BackContext,
	game: string,
	role: PlayerRole,
): Promise<void> {
	await lastValueFrom(
		combineLatest(
			merge(
				context.cardDataMapper.observe({ game }),
				from(context.cardDataMapper.read({ game })),
			),
			merge(
				context.roundDataMapper.observe({ game }),
				from(context.roundDataMapper.read({ game })),
			),
		).pipe(
			takeUntilConnectionClosed(connection),
			tap(([cards, rounds]: [Card[], Round[]]) => {
				connection.send({
					broadcastGame: {
						cards: restrictCard(role, rounds, cards),
						rounds,
					},
				});
			}),
		),
		{ defaultValue: undefined },
	);
}
