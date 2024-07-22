import { pool } from "./pool";
import Sql from "sql-template-tag";

export async function createTransaction() {
	let conn = await pool.getConnection();
	conn.beginTransaction();

	return {
		sql(strings: TemplateStringsArray, ...values: any[]) {
			if (!conn) {
				throw new Error("Transaction already committed or rolled back!");
			}

			const query = Sql(strings, ...values);
			return conn.query(query.sql, query.values);
		},
		async commit() {
			if (!conn) {
				throw new Error("Transaction already committed or rolled back!");
			}

			await conn.commit();
			await conn.release();
			conn = undefined;
		},
		async rollback() {
			if (!conn) {
				throw new Error("Transaction already committed or rolled back!");
			}

			await conn.rollback();
			await conn.release();
			conn = undefined;
		},
	};
}
