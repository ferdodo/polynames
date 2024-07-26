import { asPlayerOpenPageAndJoinGame } from "../automations";
import type { TestContext } from "../types";
import { generateLetters } from "../utils";
import { withOnePlayerJoined } from "./with-one-player-joined";

export async function withTwoPlayersJoined(
	game = generateLetters(),
): Promise<TestContext> {
	const context = await withOnePlayerJoined(game);
	const app2 = await asPlayerOpenPageAndJoinGame(context, game);
	const [app1] = context.apps;

	return {
		...context,
		game,
		apps: [app1, app2],
		cards: [],
	};
}
