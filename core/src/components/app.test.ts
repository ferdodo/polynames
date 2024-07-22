import { fireEvent, render, screen, within } from "@testing-library/preact";
import { html } from "htm/preact";
import { uid } from "uid";
import { expect, test } from "vitest";
import { App } from ".";
import { ConnectionMockFactory, createBackContextMock } from "../mocks";
import type { BackContext, FrontContext } from "../types";
import { CardKind } from "../types";
import { startServer } from "../utils";
import { createFrontContext } from "../utils/create-front-context";

const generateLetters = () =>
	[...Array(10)]
		.map(() => String.fromCharCode(97 + Math.random() * 26))
		.join("");

test("should run a game", async () => {
	const connectionFactory = new ConnectionMockFactory();
	const serverConnections$ = connectionFactory.createServer();
	const backendContext: BackContext = createBackContextMock(serverConnections$);
	const stopServer = startServer(backendContext);
	const conn1 = connectionFactory.createClient();
	const conn2 = connectionFactory.createClient();
	const context1: FrontContext = createFrontContext(conn1);
	const context2: FrontContext = createFrontContext(conn2);
	const dataTestIdA = uid();
	const dataTestIdB = uid();
	render(html`<${App} context=${context1} dataTestid=${dataTestIdA}/>`);
	render(html`<${App} context=${context2} dataTestid=${dataTestIdB}/>`);
	const componentP1 = screen.getByTestId(dataTestIdA);
	const componentP2 = screen.getByTestId(dataTestIdB);
	const input1 = within(componentP1).getByPlaceholderText("Game ID");
	const input2 = within(componentP2).getByPlaceholderText("Game ID");
	const button1 = within(componentP1).getByText("Join");
	const button2 = within(componentP2).getByText("Join");
	const game = generateLetters();
	const cardDataMapper = backendContext.cardDataMapper;
	let cards = await cardDataMapper.read({ game });

	// connect both players to the game
	await expect(within(componentP1).queryByLabelText("Playground")).toBeNull();
	await expect(within(componentP2).queryByLabelText("Playground")).toBeNull();
	await expect(
		within(componentP1).queryByPlaceholderText("Entrez un indice"),
	).toBeNull();
	await expect(
		within(componentP2).queryByPlaceholderText("Entrez un indice"),
	).toBeNull();
	await expect(
		within(componentP1).queryByPlaceholderText("Nombre de mots"),
	).toBeNull();
	await expect(
		within(componentP2).queryByPlaceholderText("Nombre de mots"),
	).toBeNull();
	await expect(
		within(componentP1).queryByLabelText("Envoyer l'indice"),
	).toBeNull();
	await expect(
		within(componentP2).queryByLabelText("Envoyer l'indice"),
	).toBeNull();

	expect(cards).toHaveLength(0);
	fireEvent.input(input1, { target: { value: game } });
	fireEvent.input(input2, { target: { value: game } });
	fireEvent.click(button1);
	fireEvent.click(button2);
	await within(componentP1).findByLabelText("Playground");
	await within(componentP2).findByLabelText("Playground");
	cards = await cardDataMapper.read({ game });
	expect(cards).toHaveLength(25);

	const [wordMasterApp, intuitionMasterApp] = await (async () => {
		try {
			await within(componentP1).findByPlaceholderText("Entrez un indice");
			return [componentP1, componentP2];
		} catch (error) {
			await within(componentP2).findByPlaceholderText("Entrez un indice");
			return [componentP2, componentP1];
		}
	})();

	const hintPrompt =
		await within(wordMasterApp).findByPlaceholderText("Entrez un indice");
	const hintCount =
		await within(wordMasterApp).findByPlaceholderText("Nombre de mots");
	const sendHint =
		await within(wordMasterApp).findByLabelText("Envoyer l'indice");

	const targetCard = cards.find((card) => card.kind === CardKind.Target);
	const neutralCard = cards.find((card) => card.kind === CardKind.Neutral);
	const target = await within(intuitionMasterApp).findByLabelText(
		targetCard.word,
	);
	const neutral = await within(intuitionMasterApp).findByLabelText(
		neutralCard.word,
	);

	// word master gives hint
	await expect(within(intuitionMasterApp).queryByText("Indice")).toBeNull();
	const hint = generateLetters();
	fireEvent.input(hintPrompt, { target: { value: hint } });
	const hintCountValue = Math.ceil(Math.random() * 3);
	fireEvent.input(hintCount, { target: { value: `${hintCountValue}` } });
	fireEvent.click(target); // those clicks shall do nothing
	fireEvent.click(neutral); // those clicks shall do nothing
	fireEvent.click(sendHint);
	await within(intuitionMasterApp).findByText(
		`Devinez les cartes ! Indice: ${hint}.`,
	);

	// intuition master selects cards
	await expect(
		within(wordMasterApp).queryByPlaceholderText("Entrez un indice"),
	).toBeNull();
	await expect(
		within(wordMasterApp).queryByPlaceholderText("Nombre de mots"),
	).toBeNull();
	fireEvent.click(target);
	fireEvent.click(neutral);
	await within(wordMasterApp).findByPlaceholderText("Entrez un indice");
	await within(wordMasterApp).findByPlaceholderText("Nombre de mots");

	stopServer();
});
