import { within } from "@testing-library/preact";
import { expect, test } from "vitest";

import {
	asIntuitionMasterSelectEliminatoryCard,
	asIntuitionMasterSelectNeutralCard,
	asIntuitionMasterSelectTargetCard,
	asWordMasterGiveHint,
} from "../automations";

import { withIntuitionMasterTurn, withWordMasterTurn } from "../fixtures";
import { generateLetters } from "../utils";

test("Word master should give a hint", async () => {
	const context = await withWordMasterTurn();
	const { intuitionMasterApp, stopServer } = context;
	const hint = generateLetters();
	const count = Math.ceil(Math.random() * 3);
	const expected = `Devinez les cartes ! Indice: ${hint}.`;
	const expected2 = `${count + 1} mots restants.`;
	await asWordMasterGiveHint(context, hint, count);
	await within(intuitionMasterApp).findByText(expected);
	expect(within(intuitionMasterApp).queryByText(expected2)).toBeTruthy();
	stopServer();
});

test("Intuition master should select a target word", async () => {
	const hint = generateLetters();
	const count = Math.ceil(Math.random() * 3);
	const context = await withIntuitionMasterTurn(hint, count);
	const { intuitionMasterApp, stopServer } = context;
	await within(intuitionMasterApp).findByText(`${count + 1} mots restants.`);
	await asIntuitionMasterSelectTargetCard(context);
	await within(intuitionMasterApp).findByText(`${count} mots restants.`);
	stopServer();
});

test("Game should end after selecting 8 target word", async () => {
	const hint = generateLetters();
	const count = 7;
	const context = await withIntuitionMasterTurn(hint, count);
	const { intuitionMasterApp, stopServer } = context;

	for (let i = 8; i > 0; i--) {
		await within(intuitionMasterApp).findByText(`${i} mots restants.`);
		await asIntuitionMasterSelectTargetCard(context);
	}

	await within(intuitionMasterApp).findByText(
		"La partie est finie ! Vous avez 92 points !",
	);

	stopServer();
});

test("Game should end when clicking the eliminatory card", async () => {
	const context = await withIntuitionMasterTurn();
	const { intuitionMasterApp, stopServer } = context;
	await asIntuitionMasterSelectEliminatoryCard(context);

	await within(intuitionMasterApp).findByText(
		"La partie est finie ! Vous avez 0 points !",
	);

	stopServer();
});

test("Turn should change when clicking a neutral card", async () => {
	const context = await withIntuitionMasterTurn();
	const { intuitionMasterApp, stopServer } = context;
	await asIntuitionMasterSelectNeutralCard(context);

	await within(intuitionMasterApp).findByText(
		"Attendez que le Maître des mots ai donné un nouvel indice...",
	);

	stopServer();
});
