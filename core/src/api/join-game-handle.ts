import type { Connection } from "connection-types";

import {
	Observable,
	bufferCount,
	combineLatest,
	filter,
	finalize,
	groupBy,
	map,
	merge,
	mergeMap,
	of,
	take,
	tap,
} from "rxjs";

import type { Subscription } from "rxjs";
import { restrictCard } from "../permissions";

import type {
	BackContext,
	Card,
	JoinGameRequest,
	Message,
	Round,
} from "../types";

import { PlayerRole } from "../types";
import { CardFactory } from "../utils";

/**
 * When a player send a join game request:
 * - The first request is grouped with another's
 *   player join request sharing the same code.
 * - Both players are provided a random signed role.
 * - Cards for this game are initialized.
 * - Game data is aggregated and broadcasted to players continuously.
 * - When both joined players have disconnected the code
 *   is available again for new connections.
 */
export function joinGameHandle({
	connections$,
	cardDataMapper,
	roundDataMapper,
	signRole,
}: BackContext): Subscription {
	return connections$
		.pipe(
			mergeMap((connection) =>
				connection.messages$.pipe(
					map((message) => message.joinGameRequest),
					filter(Boolean),
					take(1),
					map((request) => [connection, request]),
				),
			),
			groupBy(
				([_connection, request]: [Connection<Message>, JoinGameRequest]) =>
					request.game,
				null,
				(group$: Observable<[Connection<Message>, JoinGameRequest]>) =>
					new Observable((subscriber) => {
						let open = 0;

						const sub = group$
							.pipe(
								tap(() => {
									open += 1;
								}),
								mergeMap(([x]) =>
									x.messages$.pipe(
										finalize(() => {
											open -= 1;

											if (open === 0) {
												subscriber.complete();
											}
										}),
									),
								),
							)
							.subscribe();

						return () => {
							sub.unsubscribe();
						};
					}),
			),
			mergeMap((joinByGame$) => joinByGame$.pipe(bufferCount(2), take(1))),
			filter(([_first, second]) => !!second),
			mergeMap(async ([[connectionA, requestA], [connectionB, requestB]]) => {
				const [roleA, roleB] = [
					PlayerRole.IntuitionMaster,
					PlayerRole.WordMaster,
				].sort(() => Math.random() - 0.5);

				connectionA.send({
					joinGameResponse: {
						role: roleA,
						signature: await signRole(requestA.game, roleA),
					},
				});

				connectionB.send({
					joinGameResponse: {
						role: roleB,
						signature: await signRole(requestA.game, roleB),
					},
				});

				await cardDataMapper.destroy({ game: requestA.game });
				await roundDataMapper.destroy({ game: requestA.game });
				await cardDataMapper.create([...new CardFactory(requestA.game)]);
				const cardsA = await cardDataMapper.read({ game: requestA.game });
				const cardsB = await cardDataMapper.read({ game: requestA.game });

				return of(
					[connectionA, requestA, roleA, cardsA],
					[connectionB, requestA, roleB, cardsB],
				);
			}),
			mergeMap((x) => x),
			mergeMap(
				([connection, request, role, cards]: [
					Connection<Message>,
					JoinGameRequest,
					PlayerRole,
					Card[],
				]) => {
					return combineLatest(
						of(connection),
						of(role),
						merge(cardDataMapper.observe({ game: request.game }), of(cards)),
						merge(roundDataMapper.observe({ game: request.game }), of([])),
					);
				},
			),
			tap(
				([connection, role, cards, rounds]: [
					Connection<Message>,
					PlayerRole,
					Card[],
					Round[],
				]) => {
					connection.send({
						broadcastGame: {
							cards: restrictCard(role, rounds, cards),
							rounds,
						},
					});
				},
			),
		)
		.subscribe();
}
