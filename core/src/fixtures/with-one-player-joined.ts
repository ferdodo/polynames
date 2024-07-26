import { asPlayerOpenPageAndJoinGame } from "../automations";
import type { TestContext } from "../types";
import { generateLetters } from "../utils";
import { withServerStarted } from "./with-server-started";

export async function withOnePlayerJoined(
	game = generateLetters(),
): Promise<TestContext> {
	const context = await withServerStarted();
	const [app, disconnect] = await asPlayerOpenPageAndJoinGame(context, game);

	return {
		...context,
		game,
		apps: [app],
		disconnectApps: [disconnect],
		cards: [],
	};
}
