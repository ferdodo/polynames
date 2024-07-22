import { createTransaction } from "../create-transaction";

export async function createRoundTable(name: string) {
	const { sql, commit, rollback } = await createTransaction();

	try {
		await sql`
			CREATE TABLE rounds (
				id CHAR(36) PRIMARY KEY,
				game CHAR(36) NOT NULL,
				hint VARCHAR(512) NOT NULL,
				count INTEGER NOT NULL,
				position INTEGER NOT NULL,
				CONSTRAINT uc_rounds UNIQUE (game, position)
			)
		`;

		await sql`INSERT INTO migrations (name) VALUES (${name});`;
		await commit();
	} catch (e) {
		await rollback();

		if (e.code === "ER_TABLE_EXISTS_ERROR") {
			return;
		}

		throw e;
	}
}
