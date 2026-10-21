import type { DatabaseSync } from "node:sqlite";
import { createSql } from "../sql";
import { createCardTable } from "./2024-01-create-card-table";
import { createRoundTable } from "./2024-02-create-round-table";
import { createCardRoundTable } from "./2024-03-create-card-round-table";
import { addRoundSkip } from "./2024-04-add-round-skip";

export async function playMigrations(db: DatabaseSync) {
	const sql = createSql(db);

	await sql`
		CREATE TABLE IF NOT EXISTS migrations (
			name VARCHAR(512) NOT NULL PRIMARY KEY
		);
	`;

	const pastMigrations = await sql`SELECT name FROM migrations`;

	const migrations = new Map<string, (name: string) => Promise<void>>()
		.set("2024-01-create-card-table", (name) => createCardTable(db, name))
		.set("2024-02-create-round-table", (name) => createRoundTable(db, name))
		.set("2024-03-create-card-round-table", (name) =>
			createCardRoundTable(db, name),
		)
		.set("2024-04-add-round-skip", (name) => addRoundSkip(db, name));

	for (const [name, migration] of migrations) {
		if (!pastMigrations.some((m) => m.name === name)) {
			await migration(name);
		}
	}
}
