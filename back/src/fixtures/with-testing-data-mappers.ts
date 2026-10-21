import type { DatabaseSync } from "node:sqlite";
import { validateCard, validateRound } from "core";
import type { Card, Round } from "core";
import { createDataMapper } from "../create-data-mapper";
import { playMigrations } from "../migrations";
import { openDatabase } from "../pool";
import { fromSqliteRound } from "../parse-row";

export async function withTestingDataMappers() {
	const db: DatabaseSync = openDatabase(":memory:");

	await playMigrations(db);

	const cardDataMapper = createDataMapper<Card>(
		db,
		"cards",
		["id", "game", "word", "kind"],
		[],
		validateCard,
	);

	const roundDataMapper = createDataMapper<Round>(
		db,
		"rounds",
		["id", "game", "position", "count", "hint", "skip"],
		[["cards", ["id", "game", "word", "kind"]]],
		(row) => validateRound(fromSqliteRound(row)),
	);

	return { db, cardDataMapper, roundDataMapper };
}
