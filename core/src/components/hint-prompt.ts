import { html } from "htm/preact";
import { useContext, useRef, useState } from "preact/hooks";
import { giveHint } from "../api";
import { appContext } from "../app-context";
import { useCustomEventEffect, useFrontState, useGameState } from "../hooks";
import { GameState, PlayerRole } from "../types";

export function HintPrompt() {
	const gameState = useGameState();
	const context = useContext(appContext);
	const [hint, setHint] = useState("");
	const [count, setCount] = useState(undefined);
	const { role, signature, game } = useFrontState();
	const inputPrompt = useRef(null);

	const handleClickGiveHint = () => {
		giveHint(context, hint, Number(count), signature, game);
	};

	useCustomEventEffect("polynamescountinput", inputPrompt, (value) => {
		setCount(value);
	});
	useCustomEventEffect("polynamesinput", inputPrompt, (value) => {
		setHint(value);
	});

	useCustomEventEffect(
		"polynamesclickbutton",
		inputPrompt,
		handleClickGiveHint,
	);

	if (
		gameState !== GameState.WordMasterTurn ||
		role !== PlayerRole.WordMaster
	) {
		return html`<span></span>`;
	}

	return html`
		<div style="display: none;">
            <input
				type="text"
				placeholder="Entrez un indice"
				value=${hint}
				onInput=${(e) => setHint(e.target.value)} />

			<input
				type="number"
				placeholder="Nombre de mots"
				value=${count}
				onInput=${(e) => setCount(e.target.value)} />

			<button
				aria-label="Envoyer l'indice"
				onClick=${handleClickGiveHint}>
				Envoyer
			</button>
		</div>

		<div style="display: grid; place-content: center;">
			<polynames-input ref=${inputPrompt}></polynames-input>
		</div>
	`;
}
