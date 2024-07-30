import { createTransaction } from "../create-transaction";

export async function addRoundSkip(name: string) {
	const { sql, commit, rollback } = await createTransaction();

	try {
		await sql`
            ALTER TABLE rounds
            ADD COLUMN skip BOOLEAN NOT NULL DEFAULT FALSE
        `;

		await sql`INSERT INTO migrations (name) VALUES (${name});`;
		await commit();
	} catch (e) {
		await rollback();
		throw e;
	}
}
