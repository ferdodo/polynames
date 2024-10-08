import type { Connection } from "connection-types";
import { filter, finalize, map, mergeMap, tap } from "rxjs";
import type { Subscription } from "rxjs";
import type { BackContext, JoinGameRequest, Message } from "../types";
import { PlayerRole } from "../types";
import { CardFactory } from "../utils";
import { broadcastEmote } from "./broadcast-emote";
import { broadCastGame } from "./broadcast-game";

interface GameConnections {
	connectionA: Connection<Message>;
	connectionB?: Connection<Message>;
	onePlayerLeft?: boolean;
}

export function joinGameHandle(context: BackContext): Subscription {
	const playerByGames: Record<string, GameConnections> = {};

	return context.connections$
		.pipe(
			mergeMap((connection) =>
				connection.messages$.pipe(
					map((message) => message.joinGameRequest),
					filter(Boolean),
					tap(async (request: JoinGameRequest) => {
						const game = request.game;

						if (!playerByGames[game]) {
							playerByGames[game] = { connectionA: connection };
						} else if (!playerByGames[game].connectionB) {
							playerByGames[game].connectionB = connection;
							const connectionA = playerByGames[game].connectionA;
							const connectionB = playerByGames[game].connectionB;

							const [roleA, roleB] = [
								PlayerRole.IntuitionMaster,
								PlayerRole.WordMaster,
							].sort(() => Math.random() - 0.5);

							connectionA.send({
								joinGameResponse: {
									success: {
										role: roleA,
										signature: await context.signRole(game, roleA),
									},
								},
							});

							connectionB.send({
								joinGameResponse: {
									success: {
										role: roleB,
										signature: await context.signRole(game, roleB),
									},
								},
							});

							await context.cardDataMapper.destroy({ game });
							await context.roundDataMapper.destroy({ game });
							await context.cardDataMapper.create([...new CardFactory(game)]);

							broadCastGame(connectionA, context, game, roleA).catch(
								console.error,
							);

							broadCastGame(connectionB, context, game, roleB).catch(
								console.error,
							);

							broadcastEmote(context, connectionA, connectionB).catch(
								console.error,
							);
						} else {
							connection.send({
								joinGameResponse: {
									error: { gameFull: true },
								},
							});
						}
					}),
					finalize(() => {
						const gamePlayerIsIn = Object.keys(playerByGames).filter((game) => {
							return (
								playerByGames[game].connectionA === connection ||
								playerByGames[game].connectionB === connection
							);
						});

						for (const game of gamePlayerIsIn) {
							if (
								playerByGames[game].onePlayerLeft ||
								!playerByGames[game].connectionB
							) {
								delete playerByGames[game];
							} else {
								playerByGames[game].onePlayerLeft = true;
							}
						}
					}),
				),
			),
		)
		.subscribe();
}
