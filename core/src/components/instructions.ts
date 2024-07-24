import { html } from "htm/preact";

import {
	useCurrentRound,
	useFrontState,
	useGame,
	useGameState,
} from "../hooks";

import { GameState, PlayerRole } from "../types";
import { computePoints } from "../utils";

export function Instructions() {
	return html`
		<polynames-instruction>
			<${GameFinished} />
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

	const leftWords = 1 + currentRound.count - (currentRound.cards?.length || 0);
	return html`<span> ${leftWords} mots restants. </span>`;
}
