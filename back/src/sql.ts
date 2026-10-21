import type { DatabaseSync } from "node:sqlite";
import Sql, { type Sql as SqlFragment } from "sql-template-tag";

export function createSql(db: DatabaseSync) {
	return async function sql(
		strings: TemplateStringsArray,
		...values: (SqlFragment | string)[]
	): Promise<Record<string, unknown>[]> {
		const query = Sql(strings, ...values);
		const statement = db.prepare(query.sql);

		return statement.all(...query.values.map(toSqliteValue));
	};
}

function toSqliteValue(
	value: string | number | bigint | boolean | null | undefined,
): string | number | bigint | null {
	if (typeof value === "boolean") {
		return value ? 1 : 0;
	}

	return value ?? null;
}
