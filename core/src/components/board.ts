import { css } from "goober";
import { html } from "htm/preact";
import { useContext } from "preact/hooks";
import { handGuess } from "../api";
import { appContext } from "../app-context";
import { useFrontState, useGame } from "../hooks";
import { type Card, GameState, PlayerRole } from "../types";
import { computeGameState } from "../utils";

export function Board() {
	const { cards, rounds } = useGame();
	const context = useContext(appContext);
	const gameState = computeGameState(rounds, cards);
	const { role, signature, game } = useFrontState();

	if (!cards.length) {
		return html`<span></span>`;
	}

	function handleClickWord(card: Partial<Card>) {
		if (
			role === PlayerRole.IntuitionMaster &&
			gameState === GameState.IntuitionMasterTurn
		) {
			handGuess(context, game, [card], signature);
		}
	}

	const showAsGuessed = (card) =>
		role === PlayerRole.WordMaster &&
		rounds.some((round) =>
			round.cards?.map((card) => card.word).includes(card.word),
		);

	const cardsContainer = css`
		display: grid;
		place-content: center;
		text-align: center;

		& > div {
			max-width: 75rem;
		}
	`;

	return html`
		<ul aria-label="Playground" style="display: none;">
			${cards.map(
				(card) => html`
					<li>
						<label>
							${card.word}
							<input
								onClick=${() => handleClickWord(card)}
								type="checkbox"/>
						</label>
					</li>
				`,
			)}
		</ul>

		<div class=${cardsContainer}>
			<div>
				${cards.map(
					(card) => html`
						<polynames-card
							word=${card.word}
							kind=${card.kind}
							guessed=${showAsGuessed(card)}
							onClick=${() => handleClickWord(card)}
						>
						</polynames-card>
					`,
				)}
			</div>
		</div>
	`;
}
