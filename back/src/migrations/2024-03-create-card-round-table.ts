import { createTransaction } from "../create-transaction";

export async function createCardRoundTable(name: string) {
	const { sql, commit, rollback } = await createTransaction();

	try {
		await sql`
			CREATE TABLE cards_rounds (
				cards_id CHAR(36) NOT NULL,
				rounds_id CHAR(36) NOT NULL,
				PRIMARY KEY (cards_id, rounds_id),
				CONSTRAINT fk_cards_rounds_cards FOREIGN KEY (cards_id) REFERENCES cards (id) ON DELETE CASCADE,
				CONSTRAINT fk_cards_rounds_rounds FOREIGN KEY (rounds_id) REFERENCES rounds (id) ON DELETE CASCADE
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
