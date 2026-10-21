export function validateId(value: unknown): string {
	if (typeof value !== "string") {
		throw new Error("Expected id to be a string !");
	}

	return value;
}

// SQLite has no boolean type, booleans are stored as 0 or 1.
// Only the conversion is done here, the validation is in core.
export function fromSqliteRound(row: Record<string, unknown>): unknown {
	return {
		...row,
		skip: row.skip === 0 ? false : row.skip === 1 ? true : row.skip,
	};
}
