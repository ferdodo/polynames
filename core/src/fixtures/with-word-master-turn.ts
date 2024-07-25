import { fireEvent, render, screen, within } from "@testing-library/preact";
import { html } from "htm/preact";
import { uid } from "uid";
import { App } from "../components";
import { ConnectionMockFactory, createBackContextMock } from "../mocks";
import type { BackContext, FrontContext, TestContext } from "../types";
import { createFrontContext, generateLetters, startServer } from "../utils";

export async function withWordMasterTurn(): Promise<TestContext> {
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
	fireEvent.input(input1, { target: { value: game } });
	fireEvent.input(input2, { target: { value: game } });
	fireEvent.click(button1);
	fireEvent.click(button2);
	await within(componentP1).findByLabelText("Playground");
	await within(componentP2).findByLabelText("Playground");
	cards = await cardDataMapper.read({ game });

	const [wordMasterApp, intuitionMasterApp] = await (async () => {
		try {
			await within(componentP1).findByPlaceholderText("Entrez un indice");
			return [componentP1, componentP2];
		} catch (error) {
			await within(componentP2).findByPlaceholderText("Entrez un indice");
			return [componentP2, componentP1];
		}
	})();

	return {
		wordMasterApp,
		intuitionMasterApp,
		stopServer,
		cards,
	};
}
