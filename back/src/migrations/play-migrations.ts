import { sql } from "../sql";
import { createCardTable } from "./2024-01-create-card-table";
import { createRoundTable } from "./2024-02-create-round-table";
import { createCardRoundTable } from "./2024-03-create-card-round-table";
import { addRoundSkip } from "./2024-04-add-round-skip";

export async function playMigrations() {
	await sql`
		CREATE TABLE IF NOT EXISTS migrations (
			name VARCHAR(512) NOT NULL PRIMARY KEY
		);
	`;

	const pastMigrations = await sql`SELECT name FROM migrations`;

	const migrations = new Map<string, (name: string) => Promise<void>>()
		.set("2024-01-create-card-table", createCardTable)
		.set("2024-02-create-round-table", createRoundTable)
		.set("2024-03-create-card-round-table", createCardRoundTable)
		.set("2024-04-add-round-skip", addRoundSkip);

	for (const [name, migration] of migrations) {
		if (!pastMigrations.some((m) => m.name === name)) {
			await migration(name);
		}
	}
}
