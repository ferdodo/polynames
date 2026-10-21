import { html } from "htm/preact";
import type { TargetedEvent, VNode } from "preact";
import { useContext, useRef, useState } from "preact/hooks";
import { giveHint } from "../api";
import { appContext } from "../app-context";
import { useCustomEventEffect, useFrontState, useGameState } from "../hooks";
import { GameState, PlayerRole, countSchema, hintSchema } from "../types";
import { sanitizeInputValue } from "../utils";

export function HintPrompt(): VNode {
	const gameState = useGameState();
	const context = useContext(appContext);
	const [hint, setRawHint] = useState("");
	const [count, setRawCount] = useState("");
	const { role, signature, game } = useFrontState();
	const inputPrompt = useRef(null);

	const handleClickGiveHint = (): void => {
		giveHint(context, hint, Number(count), signature, game);
	};

	function setHint(value: string): void {
		const sanitized = sanitizeInputValue(
			new RegExp(hintSchema.pattern, "u"),
			hintSchema.maxLength,
			value,
		);

		setRawHint(sanitized);
		inputPrompt.current.setAttribute("hintvalue", sanitized);
	}

	function setCount(value: string): void {
		const sanitized = Number.parseInt(value) || 0;

		const valid =
			!value ||
			(Number.isInteger(sanitized) &&
				sanitized >= countSchema.minimum &&
				sanitized <= countSchema.maximum);

		if (valid) {
			setRawCount(sanitized.toString());
			inputPrompt.current.setAttribute("countvalue", sanitized || "");
		} else {
			inputPrompt.current.setAttribute("countvalue", count);
		}
	}

	useCustomEventEffect("polynamescountinput", inputPrompt, (value: string): void => {
		setCount(value);
	});
	useCustomEventEffect("polynamesinput", inputPrompt, (value: string): void => {
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
				onInput=${(e: TargetedEvent<HTMLInputElement>): void => setHint(e.currentTarget.value)} />

			<input
				type="number"
				placeholder="Nombre de mots"
				value=${count}
				onInput=${(e: TargetedEvent<HTMLInputElement>): void => setCount(e.currentTarget.value)} />

			<button
				aria-label="Envoyer l'indice"
				onClick=${handleClickGiveHint}>
				Envoyer
			</button>
		</div>

		<div style="display: grid; place-content: center;">
			<polynames-input
				ref=${inputPrompt}
				hintvalue=${hint}
				countvalue=${count}>
			</polynames-input>
		</div>
	`;
}
