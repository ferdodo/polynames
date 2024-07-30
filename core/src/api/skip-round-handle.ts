import type { Subscription } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs";
import type { BackContext } from "../types";
import { GameState, PlayerRole } from "../types";
import { computeCurrentRound, computeGameState } from "../utils";

export function skipRoundHandle({
	connections$,
	hasInvalidRole,
	roundDataMapper,
	cardDataMapper,
}: BackContext): Subscription {
	return connections$
		.pipe(
			mergeMap((connection) =>
				connection.messages$.pipe(
					map((message) => message.skipRoundRequest),
					filter(Boolean),
					tap(async ({ game, signature }) => {
						const expectedRole = PlayerRole.IntuitionMaster;

						if (await hasInvalidRole(game, expectedRole, signature)) {
							return;
						}

						const rounds = await roundDataMapper.read({ game });
						const cards = await cardDataMapper.read({ game });

						const gameState = computeGameState(rounds, cards);

						if (gameState === GameState.IntuitionMasterTurn) {
							const currentRound = computeCurrentRound(rounds);

							if (currentRound) {
								await roundDataMapper.update(
									{
										game,
										position: currentRound.position,
									},
									{
										skip: true,
									},
								);
							}
						}
					}),
				),
			),
		)
		.subscribe();
}
