import type { BackContext, Card, Round } from "core";
import { playMigrations } from "./migrations";
import { createDataMapper } from "./create-data-mapper";
import { startServer } from "core";
import { startWebSocketServer } from "./start-web-socket-server";
import { signRole } from "./sign-role";
import { hasInvalidRole } from "./hasInvalidRole";

async function main() {
	await playMigrations();

	const backContext: BackContext = {
		connections$: startWebSocketServer(),
		signRole,
		hasInvalidRole,
		cardDataMapper: createDataMapper<Card>("cards", [
			"id",
			"game",
			"word",
			"kind",
		]),
		roundDataMapper: createDataMapper<Round>(
			"rounds",
			["id", "game", "position", "count", "hint"],
			[["cards", ["id", "game", "word", "kind"]]],
		),
	};

	startServer(backContext);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
