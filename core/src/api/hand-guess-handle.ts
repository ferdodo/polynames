import type { Subscription } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs";
import type { BackContext } from "../types";
import { GameState, PlayerRole } from "../types";
import { computeCurrentRound, computeGameState } from "../utils";

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
						const round = computeCurrentRound(rounds);

						const cardsAlreadyGuessed = rounds.some((round) => {
							if (!round.cards) {
								return false;
							}

							return round.cards.some((c) =>
								cards.some((c2) => c2.word === c.word),
							);
						});

						if (
							gameState === GameState.IntuitionMasterTurn &&
							round &&
							!cardsAlreadyGuessed
						) {
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
