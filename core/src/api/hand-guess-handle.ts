import type { Subscription } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs";
import type { BackContext } from "../types";
import { GameState, PlayerRole } from "../types";
import { computeGameState } from "../utils";

export function handGuessHandle({
	connections$,
	hasInvalidRole,
	cardDataMapper,
	roundDataMapper,
}: BackContext): Subscription {
	return connections$
		.pipe(
			mergeMap((connection) =>
				connection.messages$.pipe(
					map((message) => message.handGuessRequest),
					filter(Boolean),
					tap(async ({ game, cards, signature }) => {
						const expectedRole = PlayerRole.IntuitionMaster;

						if (await hasInvalidRole(game, expectedRole, signature)) {
							return;
						}

						const currentCards = await cardDataMapper.read({ game });
						const rounds = await roundDataMapper.read({ game });
						const gameState = computeGameState(rounds, currentCards);

						const round = rounds
							.sort((a, b) => a.position - b.position)
							.findLast(Boolean);

						if (gameState === GameState.IntuitionMasterTurn && round) {
							await roundDataMapper.update(
								{
									game,
									position: round.position,
								},
								{
									cards: [...(round.cards ?? []), ...cards],
								},
							);
						}
					}),
				),
			),
		)
		.subscribe();
}
