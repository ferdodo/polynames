import { pool } from "./pool";
import Sql from "sql-template-tag";

export async function sql(strings: TemplateStringsArray, ...values: any[]) {
	const conn = await pool.getConnection();

	try {
		const query = Sql(strings, ...values);
		return await conn.query(query.sql, query.values);
	} finally {
		conn.release();
	}
}
