import { within } from "@testing-library/preact";
import type { TestContext } from "../types";
import { withTwoPlayersJoined } from "./with-two-players-joined";

export async function withWordMasterTurn(): Promise<TestContext> {
	const context = await withTwoPlayersJoined();
	const { backendContext, game } = context;
	const cardDataMapper = backendContext.cardDataMapper;

	for (const app of context.apps) {
		await within(app).findByLabelText("Playground");
	}

	const cards = await cardDataMapper.read({ game });

	if (cards.length === 0) {
		throw new Error("No cards were found !");
	}

	const [app1, app2] = context.apps;

	if (!app1 || !app2) {
		throw new Error("Expected two apps to be present !");
	}

	async function isWordMasterApp(app: HTMLElement): Promise<HTMLElement> {
		await within(app).findByPlaceholderText("Entrez un indice");
		return app;
	}

	const wordMasterApp = await Promise.race([
		isWordMasterApp(app1),
		isWordMasterApp(app2),
	]);

	const intuitionMasterApp = app1 === wordMasterApp ? app2 : app1;

	return {
		...context,
		wordMasterApp,
		intuitionMasterApp,
		cards,
	};
}
