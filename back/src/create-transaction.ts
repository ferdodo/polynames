import type { DatabaseSync } from "node:sqlite";
import { createSql } from "./sql";

export async function createTransaction(db: DatabaseSync) {
	let open = true;

	db.exec("BEGIN");

	return {
		sql: createSql(db),
		async commit() {
			if (!open) {
				throw new Error("Transaction already committed or rolled back!");
			}

			db.exec("COMMIT");
			open = false;
		},
		async rollback() {
			if (!open) {
				throw new Error("Transaction already committed or rolled back!");
			}

			db.exec("ROLLBACK");
			open = false;
		},
	};
}
