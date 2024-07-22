import type { Subscription } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs";
import { uid } from "uid";
import type { BackContext } from "../types";
import { GameState, PlayerRole } from "../types";
import { computeGameState } from "../utils";

export function giveHintHandle({
	connections$,
	hasInvalidRole,
	cardDataMapper,
	roundDataMapper,
}: BackContext): Subscription {
	return connections$
		.pipe(
			mergeMap((connection) =>
				connection.messages$.pipe(
					map((message) => message.giveHintRequest),
					filter(Boolean),
					tap(async ({ hint, count, game, signature }) => {
						const expectedRole = PlayerRole.WordMaster;

						if (await hasInvalidRole(game, expectedRole, signature)) {
							return;
						}

						const cards = await cardDataMapper.read({ game });
						const rounds = await roundDataMapper.read({ game });
						const gameState = computeGameState(rounds, cards);

						if (gameState === GameState.WordMasterTurn) {
							const round = rounds
								.sort((a, b) => a.position - b.position)
								.findLast(Boolean);

							await roundDataMapper.create({
								id: uid(),
								game,
								hint,
								count,
								position: round ? round.position + 1 : 1,
							});
						}
					}),
				),
			),
		)
		.subscribe();
}
