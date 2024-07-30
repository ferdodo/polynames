import { html } from "htm/preact";

import {
	useCurrentRound,
	useFrontState,
	useGame,
	useGameState,
} from "../hooks";

import { CardKind, GameState, PlayerRole } from "../types";
import { computePoints } from "../utils";

export function Instructions() {
	return html`
		<polynames-instruction>
			<${GameFinished} />
			<${LostTurnExplanation} />
			<${IntuitionMasterTime} />
			<${WordMasterTime} />
			<${LeftWords} />
			<${Waiting} />
		</polynames-instruction>
	`;
}

function GameFinished() {
	const { rounds } = useGame();
	const gameState = useGameState();
	const points = computePoints(rounds);

	if (gameState !== GameState.Finished) {
		return html`<span></span>`;
	}

	return html`<span>La partie est finie ! Vous avez ${points} points ! </span>`;
}

function IntuitionMasterTime() {
	const { role } = useFrontState();
	const gameState = useGameState();
	const currentRound = useCurrentRound();

	if (
		gameState !== GameState.IntuitionMasterTurn ||
		role !== PlayerRole.IntuitionMaster
	) {
		return html`<span></span>`;
	}

	return html`
		<span>Devinez les cartes ! Indice: ${currentRound.hint}.</span>
	`;
}

function WordMasterTime() {
	const { role } = useFrontState();
	const gameState = useGameState();

	if (
		gameState !== GameState.WordMasterTurn ||
		role !== PlayerRole.WordMaster
	) {
		return html`<span></span>`;
	}

	return html`
		<span>Envoyez un indice a l'autre joueur, et le nombre de cartes pour cet indice ! </span>
	`;
}

function LostTurnExplanation() {
	const { role } = useFrontState();
	const gameState = useGameState();
	const currentRound = useCurrentRound();
	const previousRound = useGame().rounds.slice(-2)[0];

	if (
		gameState === GameState.IntuitionMasterTurn ||
		role !== PlayerRole.IntuitionMaster ||
		!currentRound ||
		previousRound.skip
	) {
		return html`<span></span>`;
	}

	const neutralCardsPickedInLastRound = Boolean(
		currentRound?.cards?.find((card) => card.kind === CardKind.Neutral),
	);

	if (!neutralCardsPickedInLastRound) {
		return html`<span></span>`;
	}

	return html`<span> Zut, vous avez perdu votre tour à cause d'une carte neutre ! </span>`;
}

function Waiting() {
	const { role } = useFrontState();
	const gameState = useGameState();

	if (
		gameState === GameState.IntuitionMasterTurn &&
		role === PlayerRole.WordMaster
	) {
		return html`<span>Attendez que le Maître des intuitions ai deviné les mots... </span>`;
	}

	if (
		gameState === GameState.WordMasterTurn &&
		role === PlayerRole.IntuitionMaster
	) {
		return html`<span>Attendez que le Maître des mots ai donné un nouvel indice... </span>`;
	}

	return html`<span></span>`;
}

function LeftWords() {
	const { role } = useFrontState();
	const gameState = useGameState();
	const currentRound = useCurrentRound();

	if (
		role !== PlayerRole.IntuitionMaster ||
		gameState !== GameState.IntuitionMasterTurn
	) {
		return html`<span></span>`;
	}

	const leftWords = currentRound.count - (currentRound.cards?.length || 0);

	if (leftWords === 0) {
		return html`<span> Mot bonus ! </span>`;
	}

	return html`<span> ${leftWords} mots restants. </span>`;
}
