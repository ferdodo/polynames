import type { Subscription } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs";
import { uid } from "uid";
import type { BackContext } from "../types";
import { CardKind, GameState, PlayerRole } from "../types";
import { computeCurrentRound, computeGameState } from "../utils";

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

						const foundCards =
							rounds
								.flatMap((round) => round.cards || [])
								.filter((card) => card.kind === CardKind.Target) || [];

						if (gameState === GameState.WordMasterTurn) {
							const round = computeCurrentRound(rounds);

							await roundDataMapper.create({
								id: uid(),
								game,
								hint,
								count: Math.min(7 - foundCards.length, count),
								position: round ? round.position + 1 : 1,
								skip: false,
							});
						}
					}),
				),
			),
		)
		.subscribe();
}
