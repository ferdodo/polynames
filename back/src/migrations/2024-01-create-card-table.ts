import { createTransaction } from "../create-transaction";

export async function createCardTable(name: string) {
	const { sql, commit, rollback } = await createTransaction();

	try {
		await sql`
            CREATE TABLE cards (
				id CHAR(36) PRIMARY KEY,
				game CHAR(36) NOT NULL,
				word TEXT NOT NULL,
				kind TEXT NOT NULL
            );
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
