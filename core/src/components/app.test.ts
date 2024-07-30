import { within } from "@testing-library/preact";
import { expect, test } from "vitest";

import {
	asIntuitionMasterSelectEliminatoryCard,
	asIntuitionMasterSelectNeutralCard,
	asIntuitionMasterSelectTargetCard,
	asIntuitionMasterSkipRound,
	asPlayerOpenPageAndJoinGame,
	asWordMasterGiveHint,
} from "../automations";

import {
	withIntuitionMasterTurn,
	withOnePlayerJoined,
	withWordMasterTurn,
} from "../fixtures";

import { withTwoPlayersJoined } from "../fixtures/with-two-players-joined";
import { generateLetters } from "../utils";

test("Word master should give a hint", async () => {
	const context = await withWordMasterTurn();
	const { intuitionMasterApp, stopServer } = context;
	const hint = generateLetters();
	const count = Math.ceil(Math.random() * 3);
	const expected = `Devinez les cartes ! Indice: ${hint}.`;
	const expected2 = `${count} mots restants.`;
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
	await within(intuitionMasterApp).findByText(`${count} mots restants.`);
	await asIntuitionMasterSelectTargetCard(context);
	await within(intuitionMasterApp).findByText(`${count} mots restants.`);
	stopServer();
});

test("Game should end after selecting 8 target word", async () => {
	const hint = generateLetters();
	const count = 7;
	const context = await withIntuitionMasterTurn(hint, count);
	const { intuitionMasterApp, stopServer } = context;
	const targetWords = context.cards.map((card) => card.word)[Symbol.iterator]();

	for (let i = 7; i > 0; i--) {
		await within(intuitionMasterApp).findByText(`${i} mots restants.`);
		await asIntuitionMasterSelectTargetCard(context, targetWords.next().value);
	}

	await within(intuitionMasterApp).findByText("Mot bonus !");
	await asIntuitionMasterSelectTargetCard(context, targetWords.next().value);

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

test("When two players have joined, the game password is locked", async () => {
	const context = await withTwoPlayersJoined();
	const [app1] = await asPlayerOpenPageAndJoinGame(context);
	const [app2] = await asPlayerOpenPageAndJoinGame(context);
	await within(app1).findByText("La partie est pleine.");
	await within(app2).findByText("La partie est pleine.");
});

test("When two players have joined, and leave, the game password is released", async () => {
	const context = await withTwoPlayersJoined();
	const otherGame = generateLetters();
	const [disconnect1, disconnect2] = context.disconnectApps;
	await asPlayerOpenPageAndJoinGame(context, otherGame);
	await asPlayerOpenPageAndJoinGame(context, otherGame);
	disconnect1();
	disconnect2();
	const [app1] = await asPlayerOpenPageAndJoinGame(context);
	const [app2] = await asPlayerOpenPageAndJoinGame(context);
	await within(app1).findByLabelText("Playground");
	await within(app2).findByLabelText("Playground");
	const [app] = await asPlayerOpenPageAndJoinGame(context, otherGame);
	await within(app).findByText("La partie est pleine.");
});

test("When one player join and leave, two other can join", async () => {
	const context = await withOnePlayerJoined();
	const [disconnect] = context.disconnectApps;
	disconnect();
	const [app1] = await asPlayerOpenPageAndJoinGame(context);
	const [app2] = await asPlayerOpenPageAndJoinGame(context);
	await within(app1).findByLabelText("Playground");
	await within(app2).findByLabelText("Playground");
});

test("When two players join and one leave, game is not freed until the second player leaves", async () => {
	const context = await withTwoPlayersJoined();
	const [disconnect1, disconnect2] = context.disconnectApps;
	disconnect1();
	const [app1] = await asPlayerOpenPageAndJoinGame(context);
	await within(app1).findByText("La partie est pleine.");
	disconnect2();
	const [app2] = await asPlayerOpenPageAndJoinGame(context);
	const [app3] = await asPlayerOpenPageAndJoinGame(context);
	await within(app2).findByLabelText("Playground");
	await within(app3).findByLabelText("Playground");
});

test("Game cleaning should not affect other games", async () => {
	const context = await withOnePlayerJoined();
	const [disconnect] = context.disconnectApps;
	const otherGame = generateLetters();
	await asPlayerOpenPageAndJoinGame(context, otherGame);
	await asPlayerOpenPageAndJoinGame(context, otherGame);
	disconnect();
	const [app] = await asPlayerOpenPageAndJoinGame(context, otherGame);
	await within(app).findByText("La partie est pleine.");
});

test("Intuition master skipping round shall give hand to Word master", async () => {
	const context = await withIntuitionMasterTurn();
	const { intuitionMasterApp, stopServer } = context;
	await asIntuitionMasterSkipRound(context);

	await within(intuitionMasterApp).findByText(
		"Attendez que le Maître des mots ai donné un nouvel indice...",
	);

	stopServer();
});
