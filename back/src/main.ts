import type { BackContext, Card, Round } from "core";
import { playMigrations } from "./migrations";
import { createDataMapper } from "./create-data-mapper";
import { openDatabase } from "./pool";
import { fromSqliteRound } from "./parse-row";
import { validateCard, validateRound } from "core";
import { startServer } from "core";
import { startWebSocketServer } from "./start-web-socket-server";
import { signRole } from "./sign-role";
import { hasInvalidRole } from "./hasInvalidRole";

async function main() {
	const db = openDatabase("polynames.sqlite");

	await playMigrations(db);

	const backContext: BackContext = {
		connections$: startWebSocketServer(),
		signRole,
		hasInvalidRole,
		cardDataMapper: createDataMapper<Card>(
			db,
			"cards",
			["id", "game", "word", "kind"],
			[],
			validateCard,
		),
		roundDataMapper: createDataMapper<Round>(
			db,
			"rounds",
			["id", "game", "position", "count", "hint", "skip"],
			[["cards", ["id", "game", "word", "kind"]]],
			(row) => validateRound(fromSqliteRound(row)),
		),
	};

	startServer(backContext);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
