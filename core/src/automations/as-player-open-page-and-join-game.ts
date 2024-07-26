import { fireEvent, render, screen, within } from "@testing-library/preact";
import { html } from "htm/preact";
import { uid } from "uid";
import { App } from "../components";
import type { FrontContext, TestContext } from "../types";
import { createFrontContext, generateLetters } from "../utils";

export async function asPlayerOpenPageAndJoinGame(
	context: TestContext,
	game = generateLetters(),
): Promise<HTMLElement> {
	const { connectionFactory } = context;
	const conn = connectionFactory.createClient();
	const frontContext: FrontContext = createFrontContext(conn);
	const dataTestId = uid();
	render(html`<${App} context=${frontContext} dataTestid=${dataTestId}/>`);
	const app = screen.getByTestId(dataTestId);
	const input1 = within(app).getByPlaceholderText("Game ID");
	const button1 = within(app).getByText("Join");
	fireEvent.input(input1, { target: { value: game } });
	fireEvent.click(button1);
	return app;
}
